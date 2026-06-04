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

    // Airport coordinates {lat, lon} for distance-based pricing
    private static final Map<String, double[]> COORDS;
    static {
        Map<String, double[]> m = new HashMap<>();
        m.put("DEL",new double[]{28.5562,77.1000}); m.put("BOM",new double[]{19.0896,72.8656});
        m.put("BLR",new double[]{13.1986,77.7066}); m.put("HYD",new double[]{17.2403,78.4294});
        m.put("MAA",new double[]{12.9941,80.1709}); m.put("CCU",new double[]{22.6520,88.4463});
        m.put("GOI",new double[]{15.3808,73.8314}); m.put("COK",new double[]{10.1520,76.4019});
        m.put("AMD",new double[]{23.0771,72.6347}); m.put("PNQ",new double[]{18.5822,73.9197});
        m.put("JAI",new double[]{26.8242,75.8122}); m.put("LKO",new double[]{26.7606,80.8893});
        m.put("IXC",new double[]{30.6735,76.7885}); m.put("NAG",new double[]{21.0922,79.0472});
        m.put("VNS",new double[]{25.4524,82.8593}); m.put("PAT",new double[]{25.5913,85.0880});
        m.put("GAU",new double[]{26.1061,91.5859}); m.put("IXB",new double[]{26.6812,88.3286});
        m.put("TRV",new double[]{8.4821,76.9201});  m.put("CJB",new double[]{11.0300,77.0434});
        m.put("IXM",new double[]{9.8351,78.0934});  m.put("SXR",new double[]{33.9871,74.7742});
        m.put("ATQ",new double[]{31.7096,74.7973}); m.put("BBI",new double[]{20.2444,85.8178});
        m.put("RPR",new double[]{21.1804,81.7388}); m.put("VTZ",new double[]{17.7212,83.2244});
        m.put("IXR",new double[]{23.3143,85.3217}); m.put("DED",new double[]{30.1897,78.1804});
        m.put("IXJ",new double[]{32.6891,74.8374}); m.put("IXL",new double[]{34.1359,77.5465});
        m.put("IXE",new double[]{12.9613,74.8900}); m.put("MYQ",new double[]{12.2271,76.6496});
        m.put("IXU",new double[]{19.8627,75.3981}); m.put("HBX",new double[]{15.3617,75.0849});
        m.put("DXB",new double[]{25.2532,55.3657}); m.put("AUH",new double[]{24.4330,54.6511});
        m.put("DOH",new double[]{25.2731,51.6081}); m.put("KWI",new double[]{29.2267,47.9689});
        m.put("MCT",new double[]{23.5933,58.2844}); m.put("RUH",new double[]{24.9578,46.6989});
        m.put("JED",new double[]{21.6796,39.1565}); m.put("IST",new double[]{41.2753,28.7519});
        m.put("CMB",new double[]{7.1808,79.8841});  m.put("DAC",new double[]{23.8433,90.3978});
        m.put("KTM",new double[]{27.6966,85.3591}); m.put("MLE",new double[]{4.1918,73.5290});
        m.put("SIN",new double[]{1.3644,103.9915}); m.put("KUL",new double[]{2.7456,101.7099});
        m.put("BKK",new double[]{13.6900,100.7501});m.put("MNL",new double[]{14.5086,121.0197});
        m.put("SGN",new double[]{10.8188,106.6520});m.put("HAN",new double[]{21.2212,105.8072});
        m.put("DPS",new double[]{-8.7479,115.1670});m.put("HKT",new double[]{8.1132,98.3169});
        m.put("HKG",new double[]{22.3080,113.9185});m.put("NRT",new double[]{35.7653,140.3856});
        m.put("KIX",new double[]{34.4347,135.2440});m.put("ICN",new double[]{37.4602,126.4407});
        m.put("PEK",new double[]{40.0799,116.6031});m.put("PVG",new double[]{31.1443,121.8083});
        m.put("TPE",new double[]{25.0797,121.2342});m.put("CTU",new double[]{30.5785,103.9469});
        m.put("LHR",new double[]{51.4775,-0.4614}); m.put("CDG",new double[]{49.0097,2.5479});
        m.put("FRA",new double[]{50.0379,8.5622});  m.put("MUC",new double[]{48.3538,11.7861});
        m.put("AMS",new double[]{52.3086,4.7639});  m.put("MAD",new double[]{40.4719,-3.5626});
        m.put("BCN",new double[]{41.2971,2.0785});  m.put("FCO",new double[]{41.8003,12.2389});
        m.put("ZRH",new double[]{47.4582,8.5483});  m.put("VIE",new double[]{48.1103,16.5697});
        m.put("CPH",new double[]{55.6181,12.6561}); m.put("ARN",new double[]{59.6519,17.9186});
        m.put("DUB",new double[]{53.4213,-6.2701}); m.put("LIS",new double[]{38.7742,-9.1342});
        m.put("ATH",new double[]{37.9364,23.9445}); m.put("SVO",new double[]{55.9726,37.4146});
        m.put("BER",new double[]{52.3667,13.5033}); m.put("MAN",new double[]{53.3537,-2.2750});
        m.put("JFK",new double[]{40.6413,-73.7781});m.put("LAX",new double[]{33.9425,-118.4081});
        m.put("ORD",new double[]{41.9742,-87.9073});m.put("ATL",new double[]{33.6407,-84.4277});
        m.put("DFW",new double[]{32.8998,-97.0403});m.put("SFO",new double[]{37.6213,-122.3790});
        m.put("SEA",new double[]{47.4502,-122.3088});m.put("BOS",new double[]{42.3656,-71.0096});
        m.put("MIA",new double[]{25.7959,-80.2870});m.put("YYZ",new double[]{43.6772,-79.6306});
        m.put("YVR",new double[]{49.1947,-123.1793});m.put("MEX",new double[]{19.4363,-99.0721});
        m.put("LAS",new double[]{36.0840,-115.1537});m.put("IAH",new double[]{29.9902,-95.3368});
        m.put("GRU",new double[]{-23.4356,-46.4731});m.put("EZE",new double[]{-34.8222,-58.5358});
        m.put("BOG",new double[]{4.7016,-74.1469}); m.put("SCL",new double[]{-33.3930,-70.7858});
        m.put("LIM",new double[]{-12.0219,-77.1143});m.put("GIG",new double[]{-22.8099,-43.2505});
        m.put("CAI",new double[]{30.1219,31.4056}); m.put("JNB",new double[]{-26.1392,28.2460});
        m.put("CPT",new double[]{-33.9715,18.6021});m.put("NBO",new double[]{-1.3192,36.9275});
        m.put("ADD",new double[]{8.9779,38.7993});  m.put("LOS",new double[]{6.5774,3.3212});
        m.put("SYD",new double[]{-33.9399,151.1753});m.put("MEL",new double[]{-37.6690,144.8410});
        m.put("BNE",new double[]{-27.3842,153.1175});m.put("PER",new double[]{-31.9403,115.9669});
        m.put("AKL",new double[]{-37.0082,174.7917});m.put("DRW",new double[]{-12.4147,130.8765});
        COORDS = Collections.unmodifiableMap(m);
    }

    private static final Set<String> INDIA = Set.of(
        "DEL","BOM","BLR","HYD","MAA","CCU","GOI","COK","AMD","PNQ","JAI","LKO",
        "IXC","NAG","VNS","PAT","IXZ","GAU","IXB","TRV","CJB","IXM","BDQ","SXR",
        "JDH","UDR","ATQ","BBI","RPR","DIB","IMF","AGR","GWL","VGA","KNU","TEZ",
        "VTZ","TIR","IXR","DED","IXJ","IXL","GOP","IXD","HBX","IXG","MYQ","IXU",
        "KLH","NDC","IXE","SHL","AJL","IXA","IXS","JRH","IXI","JRG","RDP","DBR"
    );

    private static double haversineKm(String iata1, String iata2) {
        double[] c1 = COORDS.get(iata1);
        double[] c2 = COORDS.get(iata2);
        if (c1 == null || c2 == null) return 4000;
        double R    = 6371;
        double dLat = Math.toRadians(c2[0] - c1[0]);
        double dLon = Math.toRadians(c2[1] - c1[1]);
        double a    = Math.sin(dLat/2) * Math.sin(dLat/2)
                    + Math.cos(Math.toRadians(c1[0])) * Math.cos(Math.toRadians(c2[0]))
                    * Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private static long calcPrice(double distKm, boolean domestic) {
        double p;
        if (domestic) {
            if (distKm < 500)       p = distKm * 6.5 + 1200;
            else if (distKm < 1000) p = distKm * 4.8 + 1800;
            else if (distKm < 2000) p = distKm * 3.8 + 2200;
            else                    p = distKm * 3.2 + 2800;
        } else {
            if (distKm < 1500)       p = distKm * 9.5 + 2500;
            else if (distKm < 3000)  p = distKm * 8.0 + 3500;
            else if (distKm < 6000)  p = distKm * 7.0 + 5500;
            else if (distKm < 10000) p = distKm * 8.2 + 6500;
            else                     p = distKm * 7.0 + 9500;
        }
        return (Math.round(p / 100)) * 100 - 1;
    }

    private static int calcDurationMin(double distKm) {
        return (int) Math.round((distKm / 870.0) * 60) + 45;
    }

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
        String origin      = req.getOrigin().toUpperCase();
        String destination = req.getDestination().toUpperCase();

        String originCity      = airportRepository.findById(origin).map(a -> a.getCity()).orElse(origin);
        String destinationCity = airportRepository.findById(destination).map(a -> a.getCity()).orElse(destination);

        double distKm      = haversineKm(origin, destination);
        boolean isDomestic = INDIA.contains(origin) && INDIA.contains(destination);
        long    basePrice  = calcPrice(distKm, isDomestic);
        int     baseDur    = calcDurationMin(distKm);

        // Deterministic seed — same search always returns the same flights
        long seed = (origin + destination + req.getDepartureDate()).hashCode();
        Random rng = new Random(seed);

        int numFlights = 3 + rng.nextInt(3);
        List<FlightDto> results = new ArrayList<>();

        for (int i = 0; i < numFlights; i++) {
            String[] airline    = AIRLINES[Math.abs(rng.nextInt(AIRLINES.length))];
            String flightNumber = airline[0] + "-" + (100 + Math.abs(rng.nextInt(900)));

            long depOffset = (long)(rng.nextInt(18) * 3600);
            Instant dep    = departureFrom.plusSeconds(depOffset);
            int durVar     = rng.nextInt(30) - 10;
            int dur        = baseDur + durVar;
            Instant arr    = dep.plusSeconds((long) dur * 60);

            long priceVar  = (long)(rng.nextInt((int)(basePrice * 0.18)));
            long price     = basePrice + priceVar;
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
                .durationMinutes(dur)
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
