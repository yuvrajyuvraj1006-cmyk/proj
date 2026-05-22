# SkyWays Airlines ✈️

A full-stack flight booking web application built with a **microservices architecture**. SkyWays allows users to search flights, book seats, make payments via Razorpay, and receive email confirmations via SendGrid — simulating a real-world airline booking platform with enterprise-grade patterns.

---

## Project Overview

SkyWays Airlines is a distributed system consisting of **7 backend microservices** and a **React frontend**, all communicating through Apache Kafka and managed by Spring Cloud. The platform implements the **SAGA orchestration pattern** for distributed transactions, **Triple-DES encryption** for passenger PII, and **JWT-based authentication** across all services.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + TypeScript | User interface |
| Styling | Tailwind CSS | Component styling |
| Backend | Spring Boot 3.3 (Java 17) | All microservices |
| Messaging | Apache Kafka | Async event-driven communication |
| Database | PostgreSQL | Separate DB per service |
| API Gateway | Spring Cloud Gateway | Single entry point + JWT validation |
| Service Registry | Eureka (Spring Cloud) | Service discovery |
| Config Management | Spring Cloud Config Server | Centralized configuration |
| Payment | Razorpay | Payment processing |
| Email | SendGrid | Booking confirmation emails |
| Encryption | Triple-DES (3DES) | PII data protection |
| Authentication | JWT (JSON Web Tokens) | Stateless auth |
| Build Tool | Maven (multi-module) | Dependency & build management |
| Logging | Log4j2 | Structured application logging |
| Exception Handling | Custom Exception Hierarchy | Business logic error management |
| Secret Management | SecretManagerService (4-tier cascade) | API keys & credentials |

---

## Architecture

```
User (Browser)
     │
     ▼
React Frontend :3000
     │  HTTP (all requests go through gateway)
     ▼
API Gateway :8080  ──── validates JWT, injects X-User-Id header
     │
     ├──► User Service       :8091   (register, login, profiles)
     ├──► Flight Service     :8092   (search, seat reservation)
     ├──► Booking Service    :8083   (create & manage bookings)
     └──► Payment Service    :8084   (Razorpay order & verification)
                │
                ▼
         Apache Kafka (event bus)
                │
     ┌──────────┴──────────┐
     ▼                     ▼
Saga Orchestrator :8086   Notification Service :8085
(coordinates the          (sends emails via SendGrid)
 booking flow)
```

---

## Microservices

| Service | Port | Responsibility |
|---|---|---|
| **skyways-config-server** | 8888 | Serves config to all services |
| **skyways-registry** | 8761 | Eureka service discovery dashboard |
| **skyways-gateway** | 8080 | JWT auth, routing, CORS |
| **skyways-user-service** | 8091 | Registration, login, JWT issuance, profiles |
| **skyways-flight-service** | 8092 | Flight search, seat reservation/release |
| **skyways-booking-service** | 8083 | Create bookings, track status |
| **skyways-payment-service** | 8084 | Razorpay order creation & verification |
| **skyways-saga-orchestrator** | 8086 | Orchestrates the booking SAGA |
| **skyways-notification-service** | 8085 | Sends confirmation/cancellation emails |

---

## SAGA Pattern — Booking Flow

The booking process spans multiple services and is coordinated by the Saga Orchestrator via Kafka events:

```
1. BOOKING_INITIATED
        ↓
2. SEAT_RESERVATION_REQUESTED  →  SEAT_RESERVATION_CONFIRMED
        ↓
3. PAYMENT_INITIATION_REQUESTED  →  PAYMENT_PROCESSED
        ↓
4. BOOKING_CONFIRMED  +  NOTIFICATION_REQUESTED (email sent)

On failure:
PAYMENT_FAILED → SEAT_RELEASE_REQUESTED → BOOKING_CANCELLED → NOTIFICATION (cancellation email)
```

---

## Key Features

- **User Authentication** — Register/login with JWT tokens. Tokens validated at the gateway; downstream services receive `X-User-Id` header.
- **Flight Search** — Search flights by origin, destination, date, and passengers. Results sourced from mock data and external APIs (Skyscanner with circuit breaker fallback).
- **Seat Booking** — Pessimistic locking prevents overbooking under concurrent load.
- **Payment** — Razorpay integration with test mode. No real charges.
- **Email Confirmation** — SendGrid sends HTML booking confirmation/cancellation emails to the passenger's email.
- **PII Encryption** — Passenger names, passport numbers, and contact details are encrypted at rest using Triple-DES before storing in PostgreSQL.
- **SAGA Compensation** — If payment fails after a seat is reserved, the saga automatically releases the seat and cancels the booking.
- **Secret Management** — 4-tier cascade: environment variable → JVM property → `scripts/secrets.env` → GCP Secret Manager.

---

## Database Design

Each microservice has its **own isolated PostgreSQL database** (database-per-service pattern):

| Service | Database | Key Tables |
|---|---|---|
| User Service | `user_db` | `users`, `passenger_profiles`, `audit_logs` |
| Flight Service | `flight_db` | `flights`, `seats`, `airports`, `airlines` |
| Booking Service | `booking_db` | `bookings`, `booking_items`, `passengers`, `booking_status_history` |
| Payment Service | `payment_db` | `payments`, `payment_transactions`, `refunds` |
| Saga Orchestrator | `saga_db` | `saga_state` |

---

## Exception Handling

Custom exception hierarchy under `skyways-common`:

- `SkyWaysBaseException` — base for all domain exceptions
- `BookingNotFoundException`, `BookingAlreadyCancelledException`
- `FlightNotFoundException`, `FlightOverBookedException`, `SeatAlreadyReservedException`
- `PaymentFailedException`, `DuplicatePaymentException`
- `SagaCompensationException` — thrown when compensation steps fail
- `AuthenticationException`, `TokenExpiredException`, `UnauthorizedAccessException`

Each service has a `@RestControllerAdvice` exception handler that returns structured `ErrorResponse` JSON.

---

## External APIs

| API | Used For | Status |
|---|---|---|
| **Razorpay** | Payment processing (test mode) | Active |
| **SendGrid** | Booking confirmation emails | Active |
| **Skyscanner API** | Live flight search (via RapidAPI) | Wired up, circuit breaker fallback |
| **GDS** | Global Distribution System flight data | Wired up, requires API contract |
| **GCP Secret Manager** | Production secrets (cloud) | Config ready, disabled in dev |

---

## Project Structure

```
Skyways/
├── start-skyways.bat                  ← starts all services in order
├── SkyWays_Project_Documentation.md  ← full project documentation
├── skyways-airlines/
│   ├── pom.xml                        ← parent Maven POM
│   ├── scripts/
│   │   ├── secrets.env                ← local API keys (gitignored)
│   │   ├── load-secrets.ps1
│   │   └── health-check.ps1
│   ├── skyways-common/                ← shared library (DTOs, exceptions, Kafka, security)
│   ├── skyways-config-server/
│   ├── skyways-registry/
│   ├── skyways-gateway/
│   ├── skyways-user-service/
│   ├── skyways-flight-service/
│   ├── skyways-booking-service/
│   ├── skyways-payment-service/
│   ├── skyways-saga-orchestrator/
│   └── skyways-notification-service/
└── skyways-frontend/
    └── src/
        ├── pages/         ← HomePage, SearchResults, Booking, Payment, Confirmation
        ├── components/    ← FlightCard, PassengerForm, Navbar, BookingStatusBadge
        ├── api/           ← bookingApi, flightApi, paymentApi, authApi
        └── context/       ← AuthContext (JWT storage)
```

---

## How to Run (Local Development)

### Prerequisites
- Java 17 (Zulu JDK)
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+
- Apache Kafka + Zookeeper (at `C:\kafka`)

### Setup
1. Create PostgreSQL databases: `user_db`, `flight_db`, `booking_db`, `payment_db`, `saga_db`
2. Add your API keys to `skyways-airlines/scripts/secrets.env`
3. Run the startup script from the project root:

```
start-skyways.bat
```

This starts all services in the correct order. Wait **3–4 minutes** for all services to compile and register with Eureka before using the app.

### URLs
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8080 |
| Eureka Dashboard | http://localhost:8761 |

### Test Payment Card
```
Card Number : 4111 1111 1111 1111
Expiry      : Any future date
CVV         : Any 3 digits
```

---

## Security

- Passwords hashed with BCrypt
- JWT tokens validated at the gateway — services never see raw passwords
- All passenger PII (name, passport, DOB, email, phone) encrypted with Triple-DES before DB storage
- API keys stored in `secrets.env` (gitignored — never committed)
- CORS configured at the gateway level

---

## Team

**Project:** SkyWays Airlines
**Team:** Kezia and Yuvraj Mangla
