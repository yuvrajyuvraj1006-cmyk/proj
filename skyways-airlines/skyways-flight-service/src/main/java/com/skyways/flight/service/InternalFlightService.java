package com.skyways.flight.service;

import com.skyways.flight.dto.FlightDto;
import com.skyways.flight.dto.FlightSearchRequest;
import com.skyways.flight.entity.FareClass;
import com.skyways.flight.entity.Flight;
import com.skyways.flight.repository.AirportRepository;
import com.skyways.flight.repository.FareClassRepository;
import com.skyways.flight.repository.FlightRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Stream;

@Service
public class InternalFlightService {

    private static final Logger log = LogManager.getLogger(InternalFlightService.class);

    private static final String[][] AIRLINES = {
        {"SW", "SkyWays Airlines"},
        {"6E", "IndiGo"},
        {"AI", "Air India"},
        {"SG", "SpiceJet"},
        {"UK", "Vistara"},
        {"G8", "GoFirst"},
        {"EK", "Emirates"},
        {"QR", "Qatar Airways"},
        {"SQ", "Singapore Airlines"},
        {"BA", "British Airways"},
    };

    private final FlightRepository flightRepository;
    private final FareClassRepository fareClassRepository;
    private final AirportRepository airportRepository;

    public InternalFlightService(FlightRepository flightRepository,
                                  FareClassRepository fareClassRepository,
                                  AirportRepository airportRepository) {
        this.flightRepository = flightRepository;
        this.fareClassRepository = fareClassRepository;
        this.airportRepository = airportRepository;
    }

    public CompletableFuture<List<FlightDto>> searchFlightsAsync(FlightSearchRequest req) {
        return CompletableFuture.supplyAsync(() -> searchFlights(req));
    }

    public List<FlightDto> searchFlights(FlightSearchRequest req) {
        try {
            Instant departureFrom = req.getDepartureDate().atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant departureTo   = departureFrom.plusSeconds(86_400);

            List<Flight> flights = flightRepository.searchFlights(
                req.getOrigin().toUpperCase(),
                req.getDestination().toUpperCase(),
                departureFrom,
                departureTo,
                req.getPassengers(),
                PageRequest.of(req.getPage(), req.getSize())
            ).getContent();

            List<FlightDto> dbResults = flights.stream()
                .flatMap(f -> {
                    List<FareClass> fares = fareClassRepository
                        .findByFlight_FlightIdAndClassType(f.getFlightId(), req.getCabinClass());
                    if (fares.isEmpty()) return Stream.empty();
                    FareClass fare = fares.get(0);
                    long dur = (f.getArrivalTime().getEpochSecond() -
                                f.getDepartureTime().getEpochSecond()) / 60;
                    return Stream.of(FlightDto.builder()
                        .flightId(f.getFlightId())
                        .flightNumber(f.getFlightNumber())
                        .airlineName(f.getAirline().getName())
                        .airlineIata(f.getAirline().getIataCode())
                        .originIata(f.getOrigin().getIataCode())
                        .originCity(f.getOrigin().getCity())
                        .destinationIata(f.getDestination().getIataCode())
                        .destinationCity(f.getDestination().getCity())
                        .departureTime(f.getDepartureTime())
                        .arrivalTime(f.getArrivalTime())
                        .durationMinutes((int) dur)
                        .availableSeats(f.getAvailableSeats())
                        .basePrice(fare.getBasePrice())
                        .currency(fare.getCurrency())
                        .cabinClass(req.getCabinClass())
                        .source("INTERNAL")
                        .build());
                })
                .toList();

            if (!dbResults.isEmpty()) return dbResults;

            // Generate synthetic flights for any valid airport pair
            return generateSyntheticFlights(req, departureFrom);

        } catch (Exception e) {
            log.error("Internal flight search failed for {}->{}: {}",
                req.getOrigin(), req.getDestination(), e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    private List<FlightDto> generateSyntheticFlights(FlightSearchRequest req, Instant departureFrom) {
        String origin = req.getOrigin().toUpperCase();
        String destination = req.getDestination().toUpperCase();

        // Use DB city name if available, otherwise fall back to IATA code so any valid pair works
        String originCity      = airportRepository.findById(origin).map(a -> a.getCity()).orElse(origin);
        String destinationCity = airportRepository.findById(destination).map(a -> a.getCity()).orElse(destination);

        // Deterministic seed so same search always returns same flights
        long seed = (origin + destination + req.getDepartureDate()).hashCode();
        Random rng = new Random(seed);

        int numFlights = 3 + rng.nextInt(3); // 3-5 flights
        int baseDurationMinutes = 60 + Math.abs(rng.nextInt(600)); // 1h to 11h
        long basePrice = 1500L + Math.abs(rng.nextLong() % 50000);

        List<FlightDto> results = new ArrayList<>();
        for (int i = 0; i < numFlights; i++) {
            String[] airline = AIRLINES[Math.abs(rng.nextInt(AIRLINES.length))];
            String flightNumber = airline[0] + "-" + (100 + Math.abs(rng.nextInt(900)));

            long departureOffsetSeconds = (long)(rng.nextInt(20) * 3600); // spread over 20h
            Instant dep = departureFrom.plusSeconds(departureOffsetSeconds);
            Instant arr = dep.plusSeconds((long) baseDurationMinutes * 60 + rng.nextInt(30) * 60L);

            long price = basePrice + rng.nextInt(5000);
            if ("BUSINESS".equalsIgnoreCase(req.getCabinClass())) price = price * 3;
            if ("FIRST".equalsIgnoreCase(req.getCabinClass()))    price = price * 5;

            results.add(FlightDto.builder()
                .flightId(UUID.randomUUID())
                .flightNumber(flightNumber)
                .airlineName(airline[1])
                .airlineIata(airline[0])
                .originIata(origin)
                .originCity(originCity)
                .destinationIata(destination)
                .destinationCity(destinationCity)
                .departureTime(dep)
                .arrivalTime(arr)
                .durationMinutes(baseDurationMinutes + rng.nextInt(30))
                .availableSeats(50 + rng.nextInt(200))
                .basePrice(BigDecimal.valueOf(price))
                .currency("INR")
                .cabinClass(req.getCabinClass())
                .source("INTERNAL")
                .build());
        }

        results.sort(Comparator.comparing(FlightDto::getBasePrice));
        return results;
    }
}
