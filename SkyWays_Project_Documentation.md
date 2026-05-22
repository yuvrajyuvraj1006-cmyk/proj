# SkyWays Airlines — Complete Project Documentation

---

## 1. Project Overview

SkyWays Airlines is a full-stack flight booking web application built using a **microservices architecture**. It allows users to search for flights, book seats, make payments via Razorpay, and receive email confirmations via SendGrid. The system is designed to simulate a real-world airline booking platform with enterprise-grade patterns including event-driven architecture, SAGA orchestration, and PII encryption.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React (TypeScript), Tailwind CSS |
| Backend | Spring Boot 3.3, Java 17 |
| Architecture | Microservices |
| Messaging | Apache Kafka |
| Database | PostgreSQL (separate DB per service) |
| Payment | Razorpay |
| Email | SendGrid |
| Service Registry | Eureka (Spring Cloud) |
| Config Management | Spring Cloud Config Server |
| API Gateway | Spring Cloud Gateway |
| Encryption | Triple-DES (3DES) for PII |
| Auth | JWT (JSON Web Tokens) |
| Build Tool | Maven |

---

## 3. High-Level Architecture

```
User (Browser)
     │
     ▼
Frontend (React) :3000
     │  HTTP requests (all go through gateway)
     ▼
API Gateway :8080  ← validates JWT, injects X-User-Id header
     │
     ├──► User Service       :8091  (auth, profiles)
     ├──► Flight Service     :8092  (search, seats)
     ├──► Booking Service    :8083  (bookings)
     └──► Payment Service    :8084  (Razorpay)
                │
                ▼
           Apache Kafka (event bus)
                │
     ┌──────────┴──────────┐
     ▼                     ▼
SAGA Orchestrator     Notification Service
     :8086                 :8085
     │
     ▼
Eureka Registry :8761  (all services register here)
Config Server   :8888  (centralized config)
```

---

## 4. Complete File Structure

```
Skyways/
│
├── start-skyways.bat                  ← starts all services in order
│
├── skyways-frontend/                  ← React TypeScript frontend
│   └── src/
│       ├── api/
│       │   ├── apiConfig.ts           ← axios base config, JWT header injection
│       │   ├── bookingApi.ts          ← booking API calls
│       │   ├── flightApi.ts           ← flight search API calls
│       │   ├── paymentApi.ts          ← payment API calls
│       │   └── mockFlights.ts         ← generates mock flight data (no Docker needed)
│       ├── components/
│       │   ├── Navbar.tsx             ← top navigation bar
│       │   ├── Footer.tsx             ← footer with tech stack info
│       │   ├── FlightCard.tsx         ← single flight result card
│       │   ├── PassengerForm.tsx      ← passenger details input form
│       │   ├── BookingStatusBadge.tsx ← colored status badge (Processing/Confirmed/etc)
│       │   └── Spinner.tsx            ← loading spinner component
│       ├── context/
│       │   └── AuthContext.tsx        ← global auth state (JWT token, user info)
│       ├── pages/
│       │   ├── HomePage.tsx                  ← flight search form
│       │   ├── SearchResultsPage.tsx         ← flight results with sort/filter
│       │   ├── BookingPage.tsx               ← passenger details + contact form
│       │   ├── PaymentPage.tsx               ← Razorpay checkout
│       │   ├── BookingConfirmationPage.tsx   ← confirmation + auto-polling
│       │   ├── MyBookingsPage.tsx            ← all user bookings
│       │   ├── LoginPage.tsx                 ← login form
│       │   ├── RegisterPage.tsx              ← registration form
│       │   └── ProfilePage.tsx               ← user profile management
│       └── types/
│           └── index.ts               ← all TypeScript interfaces/types
│
└── skyways-airlines/                  ← all backend microservices
    │
    ├── scripts/
    │   └── secrets.env                ← all local secrets (never commit to git)
    │
    ├── skyways-common/                ← shared library used by all services
    │   └── src/main/java/com/skyways/common/
    │       ├── enums/
    │       │   └── KafkaTopics.java   ← all Kafka topic name constants
    │       ├── kafka/
    │       │   └── KafkaEventEnvelope.java  ← wrapper for all Kafka messages
    │       ├── security/
    │       │   ├── JwtService.java          ← JWT create/validate
    │       │   ├── TripleDESEncryptor.java  ← PII encryption/decryption
    │       │   └── SecretManagerService.java ← reads secrets from env/file/GCP
    │       └── exception/             ← shared exception classes
    │
    ├── skyways-config-server/         ← Spring Cloud Config Server :8888
    │
    ├── skyways-registry/              ← Eureka Service Registry :8761
    │
    ├── skyways-gateway/               ← API Gateway :8080
    │   └── src/main/java/com/skyways/gateway/
    │       └── filter/
    │           └── JwtAuthenticationFilter.java  ← validates JWT on every request
    │
    ├── skyways-user-service/          ← User Service :8091
    │   └── src/main/java/com/skyways/user/
    │       ├── controller/
    │       │   └── UserController.java      ← REST endpoints
    │       ├── service/
    │       │   └── UserService.java         ← business logic
    │       ├── entity/
    │       │   └── User.java                ← user DB entity
    │       └── kafka/
    │           └── UserEventProducer.java   ← publishes user events
    │
    ├── skyways-flight-service/        ← Flight Service :8092
    │   └── src/main/java/com/skyways/flight/
    │       ├── controller/
    │       │   └── FlightController.java    ← search endpoint
    │       ├── service/
    │       │   ├── FlightService.java       ← flight search logic
    │       │   └── SeatService.java         ← seat reservation logic
    │       ├── entity/
    │       │   ├── Flight.java              ← flight DB entity
    │       │   └── Seat.java                ← seat DB entity
    │       └── kafka/
    │           └── SeatReservationConsumer.java  ← handles seat reservation events
    │
    ├── skyways-booking-service/       ← Booking Service :8083
    │   └── src/main/java/com/skyways/booking/
    │       ├── controller/
    │       │   └── BookingController.java   ← booking endpoints
    │       ├── service/
    │       │   ├── BookingService.java      ← booking creation + status updates
    │       │   └── PassengerValidationService.java ← validates passenger data
    │       ├── entity/
    │       │   ├── Booking.java             ← booking DB entity
    │       │   ├── Passenger.java           ← passenger DB entity (PII encrypted)
    │       │   ├── BookingItem.java         ← links booking to flight
    │       │   └── BookingStatus.java       ← enum: INITIATED/CONFIRMED/CANCELLED etc
    │       ├── dto/
    │       │   ├── CreateBookingRequest.java ← booking creation request body
    │       │   └── BookingSummaryDto.java    ← response sent to frontend
    │       └── kafka/
    │           ├── BookingEventProducer.java ← publishes BOOKING_INITIATED
    │           └── SagaEventConsumer.java    ← listens for BOOKING_CONFIRMED/CANCELLED
    │
    ├── skyways-payment-service/       ← Payment Service :8084
    │   └── src/main/java/com/skyways/payment/
    │       ├── controller/
    │       │   └── PaymentController.java   ← create-order, verify endpoints
    │       ├── service/
    │       │   ├── PaymentService.java      ← payment logic
    │       │   └── RazorpayService.java     ← Razorpay API integration
    │       ├── entity/
    │       │   └── Payment.java             ← payment DB entity
    │       └── kafka/
    │           ├── PaymentEventConsumer.java ← listens for PAYMENT_INITIATION_REQUESTED
    │           └── PaymentEventProducer.java ← publishes PAYMENT_PROCESSED/FAILED
    │
    ├── skyways-saga-orchestrator/     ← SAGA Orchestrator :8086
    │   └── src/main/java/com/skyways/saga/
    │       ├── kafka/
    │       │   └── SagaEventRouter.java     ← routes Kafka events to handlers
    │       ├── service/
    │       │   └── SagaOrchestrationService.java ← all SAGA logic
    │       └── entity/
    │           ├── SagaState.java           ← tracks current step of each saga
    │           └── SagaStatus.java          ← enum: PENDING/COMPLETED/COMPENSATED etc
    │
    └── skyways-notification-service/  ← Notification Service :8085
        └── src/main/java/com/skyways/notification/
            ├── kafka/
            │   └── NotificationEventConsumer.java ← listens for NOTIFICATION_REQUESTED
            ├── service/
            │   ├── SendGridService.java      ← calls SendGrid API
            │   └── EmailTemplateService.java ← builds HTML email body
            └── dto/
                └── BookingConfirmationDto.java ← email data transfer object
```

---

## 5. How All Components Are Connected

### 5.1 Frontend ↔ Backend
- All API calls go from React → API Gateway (`:8080`)
- Axios is configured in `apiConfig.ts` with base URL `http://localhost:8080/api/v1`
- JWT token is attached to every request as `Authorization: Bearer <token>`
- Gateway validates the token and forwards the request to the correct service

### 5.2 Services ↔ Eureka
- Every microservice registers itself with Eureka on startup
- Gateway uses Eureka to discover where each service is running
- Services don't need to know each other's ports — Eureka handles it

### 5.3 Services ↔ Config Server
- Each service has `spring.config.import: optional:configserver:http://localhost:8888` in its `application.yml`
- On startup, services pull their configuration from the Config Server
- Secrets are loaded via `SecretManagerService` which reads `scripts/secrets.env`

### 5.4 Services ↔ Kafka
- Services communicate asynchronously through Kafka topics
- No service calls another service directly via HTTP (except frontend → gateway)
- Each service publishes events to topics and subscribes to topics it cares about

---

## 6. The SAGA Pattern Explained

The SAGA pattern solves the problem of distributed transactions. In microservices, you cannot have a single database transaction across multiple services. Instead, you chain a series of events:

### Happy Path
```
1. User submits booking
        ↓
2. Booking Service creates booking (status: INITIATED)
   Publishes → BOOKING_INITIATED
        ↓
3. SAGA receives BOOKING_INITIATED
   Publishes → SEAT_RESERVATION_REQUESTED
        ↓
4. Flight Service receives SEAT_RESERVATION_REQUESTED
   - Real flight in DB → reserves actual seats
   - Mock/synthetic flight → sends virtual confirmation
   Publishes → SEAT_RESERVATION_CONFIRMED
        ↓
5. SAGA receives SEAT_RESERVATION_CONFIRMED
   Publishes → PAYMENT_INITIATION_REQUESTED
        ↓
6. User completes Razorpay payment
   Payment Service publishes → PAYMENT_PROCESSED
        ↓
7. SAGA receives PAYMENT_PROCESSED
   Publishes → BOOKING_CONFIRMED + NOTIFICATION_REQUESTED
        ↓
8. Booking Service updates status to CONFIRMED
   Notification Service sends confirmation email
```

### Compensation Path (if something fails)
```
SEAT_RESERVATION_FAILED or PAYMENT_FAILED
        ↓
SAGA publishes → SEAT_RELEASE_REQUESTED (undo seat hold)
        ↓
SAGA publishes → BOOKING_CANCELLED
        ↓
Booking Service updates status to CANCELLED
Notification Service sends cancellation email
```

---

## 7. Kafka Topics Reference

| Topic Name | Published By | Consumed By | Purpose |
|---|---|---|---|
| `booking-initiated` | Booking Service | SAGA Orchestrator | Start the booking saga |
| `seat-reservation-requested` | SAGA | Flight Service | Reserve seats on the flight |
| `seat-reservation-confirmed` | Flight Service | SAGA | Seats reserved successfully |
| `seat-reservation-failed` | Flight Service | SAGA | Seat reservation failed |
| `payment-initiation-requested` | SAGA | Payment Service | Create Razorpay order |
| `payment-processed` | Payment Service | SAGA | Payment completed by user |
| `payment-failed` | Payment Service | SAGA | Payment declined/failed |
| `booking-confirmed` | SAGA | Booking Service | Update booking to CONFIRMED |
| `booking-cancelled` | SAGA | Booking Service, Payment Service | Cancel booking + trigger refund |
| `seat-release-requested` | SAGA | Flight Service | Release reserved seats |
| `notification-requested` | SAGA | Notification Service | Send confirmation/cancellation email |

---

## 8. Complete Booking Journey (Step by Step)

| Step | Page/Service | What Happens |
|---|---|---|
| 1 | `HomePage.tsx` | User enters origin, destination, date, passengers |
| 2 | `SearchResultsPage.tsx` | Flights fetched (mock or real), sorted by price/duration/departure |
| 3 | `FlightCard.tsx` | User clicks "Book" — flight data passed via router state |
| 4 | `BookingPage.tsx` | User fills passenger details + contact email |
| 5 | `BookingService` | `POST /bookings` — booking created, status = INITIATED, BOOKING_INITIATED published |
| 6 | `PaymentPage.tsx` | Frontend calls `POST /payments/create-order` → Razorpay order created |
| 7 | `PaymentPage.tsx` | Razorpay popup opens — user pays with test card |
| 8 | `PaymentService` | `POST /payments/verify` — signature verified, PAYMENT_PROCESSED published |
| 9 | `SagaOrchestrationService` | Receives PAYMENT_PROCESSED → publishes BOOKING_CONFIRMED + NOTIFICATION_REQUESTED |
| 10 | `BookingConfirmationPage.tsx` | Auto-polls every 3 seconds (up to 60s) until status = CONFIRMED |
| 11 | `NotificationService` | Sends confirmation email via SendGrid to contact email |

---

## 9. Mock Flight System

Since the project runs locally without Docker (no real flight database), the frontend generates mock flights in `mockFlights.ts`.

**How it works:**
- Based on the origin and destination IATA codes, it determines the region (India domestic, Middle East, Europe, etc.)
- Assigns realistic airlines (domestic routes → IndiGo, Air India, SpiceJet etc; international → Emirates, Qatar Airways, etc.)
- Calculates base prices per region pair (e.g. India-India = ₹2,000–₹20,000; India-Europe = ₹45,000+)
- Generates valid UUIDs in format `00000000-0000-4000-8000-XXXXXXXXXXXX`
- These UUIDs are synthetic — when the flight service receives a seat reservation request for them, it detects they are not in the DB and sends a **virtual seat confirmation** so the booking can proceed

---

## 10. Security Implementation

### JWT Flow
1. User logs in → User Service validates credentials → returns JWT token
2. Frontend stores JWT in memory (AuthContext)
3. Every API request includes `Authorization: Bearer <jwt>`
4. API Gateway's `JwtAuthenticationFilter` validates the token
5. If valid → extracts userId → injects as `X-User-Id` header → forwards request
6. If invalid → returns 401 Unauthorized

### PII Encryption (Triple-DES)
- Passenger data (first name, last name, passport number, date of birth) is encrypted before storing in PostgreSQL
- Uses 3DES with a 24-byte key stored in `secrets.env` as `TRIPLE_DES_KEY`
- `TripleDESEncryptor.java` handles encrypt/decrypt

### Secrets Management
- `SecretManagerService` uses a 4-tier cascade to load secrets:
  1. OS environment variable
  2. JVM system property
  3. `scripts/secrets.env` file (local dev)
  4. GCP Secret Manager (production)

---

## 11. Database Schema Summary

### user_db (User Service)
- `users` — id, email, password (bcrypt), first_name, last_name, role, created_at

### booking_db (Booking Service)
- `bookings` — booking_id, user_id, booking_ref, total_amount, currency, status, saga_id, created_at
- `passengers` — id, booking_id, first_name (encrypted), last_name (encrypted), passport_no (encrypted), nationality, dob (encrypted)
- `booking_items` — id, booking_id, flight_id, fare_class, price
- `booking_status_history` — id, booking_id, old_status, new_status, reason, changed_at

### payment_db (Payment Service)
- `payments` — payment_id, booking_id, razorpay_order_id, gateway_payment_id, amount, currency, status, saga_id

### flight_db (Flight Service)
- `flights` — flight_id, flight_number, airline, origin, destination, departure_time, arrival_time, available_seats
- `seats` — seat_id, flight_id, seat_number, is_reserved, booking_id, reserved_at

### saga_db (SAGA Orchestrator)
- `saga_state` — saga_id, booking_id, status, current_step, failure_reason, compensation_step, created_at, updated_at

---

## 12. Booking Status Flow

```
INITIATED → SEAT_RESERVED → PAYMENT_PENDING → CONFIRMED
                                    ↓
                              (if failed)
                                    ↓
                               CANCELLED → REFUNDED
```

| Status | Displayed As | Meaning |
|---|---|---|
| INITIATED | Processing | Booking created, SAGA starting |
| SEAT_RESERVED | Seat Reserved | Seats held on flight |
| PAYMENT_PENDING | Awaiting Payment | Waiting for user to pay |
| CONFIRMED | Confirmed | Payment done, booking complete |
| CANCELLED | Cancelled | Something failed or user cancelled |
| REFUNDED | Refunded | Payment refunded to user |

---

## 13. API Endpoints Reference

### User Service (:8091)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login, returns JWT |
| GET | `/api/v1/users/profile` | Get logged-in user profile |
| PUT | `/api/v1/users/profile` | Update profile |

### Flight Service (:8092)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/flights/search` | Search flights by origin, destination, date |

### Booking Service (:8083)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/bookings` | Create a new booking |
| GET | `/api/v1/bookings/{bookingRef}` | Get booking by reference |
| GET | `/api/v1/bookings/my` | Get all bookings for current user |
| POST | `/api/v1/bookings/{bookingRef}/cancel` | Cancel a booking |

### Payment Service (:8084)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/payments/create-order` | Create Razorpay order |
| POST | `/api/v1/payments/verify` | Verify payment after user pays |

---

## 14. secrets.env — What Each Key Does

Located at: `skyways-airlines/scripts/secrets.env`

```
RAZORPAY_KEY_ID         → Public key for Razorpay (sent to frontend)
RAZORPAY_KEY_SECRET     → Private key for Razorpay signature verification
SENDGRID_API_KEY        → Full Access API key from SendGrid dashboard
SENDGRID_FROM_EMAIL     → Verified sender email in SendGrid
SKYSCANNER_API_KEY      → RapidAPI key for Skyscanner flight search
GDS_API_KEY             → Amadeus/Sabre GDS key for real flight data
TRIPLE_DES_KEY          → 24-byte Base64 key for PII encryption
JWT_SECRET              → Secret for signing JWT tokens
USER_DB_PASS            → PostgreSQL password for user_db
FLIGHT_DB_PASS          → PostgreSQL password for flight_db
BOOKING_DB_PASS         → PostgreSQL password for booking_db
PAYMENT_DB_PASS         → PostgreSQL password for payment_db
SAGA_DB_PASS            → PostgreSQL password for saga_db
EUREKA_USER             → Eureka dashboard username
EUREKA_PASSWORD         → Eureka dashboard password
```

---

## 15. Starting the Project

Run in **Command Prompt** (not PowerShell):
```
cd C:\Users\yuvraj.mangla\Desktop\Skyways && start-skyways.bat
```

### Startup Order (handled automatically by start-skyways.bat)
1. Kill any existing Java/Node processes
2. Start **Zookeeper** (Kafka dependency) — wait 8s
3. Start **Kafka** — wait 12s
4. Start **Config Server** — wait 25s
5. Start **Eureka Registry** — wait 25s
6. Start **User Service** (:8091) — wait 10s
7. Start **Flight Service** (:8092) — wait 10s
8. Start **Booking Service** (:8083) — wait 10s
9. Start **Payment Service** (:8084) — wait 10s
10. Start **SAGA Orchestrator** (:8086) — wait 10s
11. Start **Notification Service** (:8085) — wait 30s
12. Start **API Gateway** (:8080) — wait 20s
13. Start **React Frontend** (:3000)

All Java services use `mvn spring-boot:run` which **compiles from source** on every start. This means code changes are automatically picked up after a restart.

---

## 16. Razorpay Test Card Details

| Field | Value |
|---|---|
| Card Number | 4111 1111 1111 1111 |
| Expiry | Any future date (e.g. 12/29) |
| CVV | Any 3 digits (e.g. 123) |
| OTP | 1234 |

No real money is charged. Razorpay test mode is used.

---

## 17. Common Issues and Solutions

| Issue | Cause | Fix |
|---|---|---|
| Booking stuck at "Processing" | SAGA service not started or crashed | Restart all services with start-skyways.bat |
| "An unexpected error occurred" on booking | Invalid flight UUID format | Fixed — mock flights now generate valid UUIDs |
| No confirmation email | SendGrid API key invalid or sender not verified | Generate real API key from SendGrid dashboard + verify sender email |
| 401 Unauthorized | JWT expired or missing | Log out and log back in |
| Flight search returns no results | Backend flight API unavailable | Mock flights generated in frontend automatically |
| Services not registering with Eureka | Services started before Eureka was ready | Wait for Eureka to fully start, then restart other services |

---

## 18. Key Design Decisions

1. **Separate databases per service** — each microservice owns its data. No service reads another service's database directly.

2. **Kafka for async communication** — services communicate through events, not direct HTTP calls. This makes the system resilient — if one service is down, events queue up and are processed when it comes back.

3. **SAGA pattern** — handles distributed transactions without a two-phase commit. Each step is reversible through compensation.

4. **Virtual seat confirmation** — since mock flights don't exist in the flight database, the system detects this and confirms the seat virtually so the booking flow can complete.

5. **PII encryption** — passenger personal data is encrypted at rest using Triple-DES, ensuring data privacy even if the database is compromised.

6. **Single gateway entry point** — the API Gateway is the only service exposed to the frontend. All JWT validation happens here, keeping individual services simpler.

---

## 17. Technologies Used and Why

This section explains every major technology used in SkyWays and the reasoning behind choosing it.

---

### 17.1 Spring Boot 3.3 (Java 17)

**What it is:** An opinionated Java framework that makes building production-ready applications fast by providing auto-configuration, embedded servers, and starter dependencies.

**Why we used it:**
- Java is the industry standard for enterprise backend development. Spring Boot removes the boilerplate of traditional Spring XML configuration.
- Built-in support for REST APIs, JPA, Kafka, Security, and Config Server — all the components we needed in one ecosystem.
- Every microservice in SkyWays is a Spring Boot application, making the codebase consistent and easy to navigate.
- Spring Boot's embedded Tomcat server means each service runs as a standalone JAR — no external server setup needed.

**Problem it solves:** Building 7 microservices (user, flight, booking, payment, notification, saga, gateway) from scratch without a framework would take months. Spring Boot lets us focus on business logic instead of infrastructure wiring.

---

### 17.2 Apache Kafka

**What it is:** A distributed event streaming platform used to publish and consume messages (events) between services asynchronously.

**Why we used it:**
- SkyWays needs services to communicate without being tightly coupled. With Kafka, the Booking Service just publishes a `BOOKING_INITIATED` event and doesn't need to know who handles it or when.
- Kafka retains messages, so if the Saga Orchestrator is temporarily down, no events are lost — they queue up and are processed on restart.
- Kafka naturally supports the SAGA pattern because each step publishes an event that triggers the next step.
- It decouples the payment flow from the booking flow — the Booking Service doesn't call Payment directly; Kafka carries the message.

**Problem it solves:** Without Kafka, services would need to call each other via HTTP synchronously. If Payment Service is slow, Booking Service blocks. With Kafka, each service does its job and fires an event — the rest happens asynchronously without waiting.

**Topics used in SkyWays:**
- `booking-initiated` → `seat-reservation-requested` → `seat-reservation-confirmed`
- `payment-initiation-requested` → `payment-processed` / `payment-failed`
- `booking-confirmed` → `notification-requested`

---

### 17.3 PostgreSQL

**What it is:** An open-source relational database management system known for reliability, ACID compliance, and advanced features.

**Why we used it:**
- Airline booking data is highly relational — flights have seats, bookings reference users and flights, payments reference bookings. PostgreSQL handles these relationships natively with foreign keys and joins.
- ACID compliance ensures that a seat reservation and a booking record are either both saved or both rolled back — critical for preventing overbooking.
- SkyWays uses **one separate database per service** (database-per-service pattern). This means Flight Service has its own DB, Booking Service has its own DB, etc. PostgreSQL allows us to run multiple databases on the same server instance.
- Pessimistic locking (`SELECT ... FOR UPDATE`) used in `SeatService.reserveSeats()` prevents two users from booking the same seat simultaneously — a PostgreSQL feature used directly.

**Problem it solves:** Prevents data corruption in concurrent booking scenarios. If 100 users try to book the last seat at the same time, PostgreSQL's locking ensures only one succeeds.

---

### 17.4 React (TypeScript)

**What it is:** React is a JavaScript library for building user interfaces. TypeScript adds static typing to JavaScript.

**Why we used it:**
- React's component-based model lets us build reusable UI pieces — `FlightCard`, `BookingSummary`, `StatusBadge` — that are consistent across pages.
- TypeScript catches bugs at compile time. For example, if the API returns a `bookingRef` (string) but a component expects a `bookingId` (UUID), TypeScript flags this before the user sees a broken UI.
- React's state management (hooks) makes it easy to handle async API calls — show a loading spinner while the booking is being confirmed, then update the UI when the response arrives.
- The SkyWays frontend uses TypeScript `interface` definitions that mirror the backend DTOs exactly, preventing mismatches between frontend and backend contracts.

**Problem it solves:** Without TypeScript, a field rename in the backend (e.g., `bookingRef` → `reference`) would silently break the frontend. TypeScript makes these errors visible immediately.

---

### 17.5 Tailwind CSS

**What it is:** A utility-first CSS framework where you style elements by composing small utility classes directly in HTML/JSX.

**Why we used it:**
- Tailwind eliminates the need to write custom CSS files. Classes like `bg-blue-600 text-white rounded-lg px-4 py-2` directly express the design.
- Consistent design system out of the box — spacing, colors, and typography follow a fixed scale, so the UI looks cohesive without a custom design system.
- Tailwind is extremely fast to iterate with — changing `bg-blue-600` to `bg-green-600` immediately updates the color without touching a CSS file.
- Works natively with React component-based development.

**Problem it solves:** Writing and maintaining traditional CSS files for a multi-page app (flight search, booking form, confirmation, profile) is time-consuming and leads to style conflicts. Tailwind keeps styles co-located with the components that use them.

---

### 17.6 Spring Cloud Gateway

**What it is:** A reverse proxy and API gateway built on Spring Boot that routes incoming requests to appropriate microservices.

**Why we used it:**
- The frontend only needs to know one URL (`http://localhost:8080`). The gateway routes `/api/flights/**` to Flight Service, `/api/bookings/**` to Booking Service, etc.
- **JWT authentication is centralized here.** Every request passes through the gateway, which validates the JWT token and injects the `X-User-Id` header. Individual services trust this header and don't need their own auth logic.
- CORS configuration is handled once in the gateway, not in every service.
- If we scale a service (e.g., run 3 instances of Booking Service), the gateway load-balances across them automatically.

**Problem it solves:** Without a gateway, the frontend would need to know 7 different ports and URLs. Every service would need its own JWT validation code. Security would be inconsistent.

---

### 17.7 Eureka (Spring Cloud Service Registry)

**What it is:** A service registry where microservices register themselves, and other services discover them by name instead of hard-coded URLs.

**Why we used it:**
- Services register with Eureka at startup with a logical name (e.g., `skyways-booking-service`). The gateway routes to `http://skyways-booking-service/` and Eureka resolves this to the actual host:port.
- If a service moves to a different port (e.g., during scaling), nothing needs to be reconfigured — Eureka handles the discovery.
- The Eureka dashboard (`http://localhost:8761`) shows which services are UP or DOWN at a glance, useful for debugging.

**Problem it solves:** Hard-coding `localhost:8083` everywhere breaks when services move or scale. Eureka provides dynamic service discovery.

---

### 17.8 Spring Cloud Config Server

**What it is:** A centralized configuration server that serves `application.yml` properties to all microservices from a single source.

**Why we used it:**
- Instead of each service having a different `application.yml`, shared config (Kafka broker address, Eureka URL, database passwords) can be managed in one place.
- In SkyWays, each service's `bootstrap.yml` points to the Config Server which serves the configuration on startup.
- Changing a Kafka broker address only requires updating the Config Server — not editing 7 service config files.

**Problem it solves:** Configuration drift — when different services have slightly different settings for the same config key, causing hard-to-debug inconsistencies.

---

### 17.9 Razorpay

**What it is:** A payment gateway that processes credit/debit card payments in India with test mode support.

**Why we used it:**
- Razorpay provides a complete test environment with test API keys and a test card (`4111 1111 1111 1111`) — no real money is charged during development.
- The Razorpay SDK handles PCI compliance — sensitive card data never touches our servers. The frontend sends card details directly to Razorpay, which returns a payment token.
- Razorpay's dashboard shows every test transaction with full details — useful for verifying the payment flow worked correctly.
- Simple REST API for creating orders and verifying payments.

**Why Razorpay over Stripe or PayPal:**
- Razorpay is India-focused with INR support and is commonly used in Indian fintech projects. Stripe requires a business account. PayPal has limited test mode support.

**Problem it solves:** Implementing a real payment system from scratch requires handling card encryption, fraud detection, and bank communication — Razorpay abstracts all of this.

---

### 17.10 SendGrid

**What it is:** A cloud-based email delivery service with an API for sending transactional emails (confirmations, notifications).

**Why we used it:**
- Sending email directly from a server (SMTP) gets flagged as spam by Gmail, Outlook, etc. SendGrid has established sender reputation and deliverability.
- Simple REST API — send an email by making one HTTP POST call with the recipient, subject, and HTML body.
- Free tier supports 100 emails/day — sufficient for a development/demo project.
- Single Sender Verification lets us send from a verified Gmail address without setting up a custom domain.

**Problem it solves:** Booking confirmation emails need to reliably reach the user's inbox. Raw SMTP from a local server would be blocked by spam filters. SendGrid ensures delivery.

---

### 17.11 JWT (JSON Web Tokens)

**What it is:** A compact, URL-safe token format for securely transmitting authentication information between client and server.

**Why we used it:**
- JWTs are stateless — the server doesn't need a database lookup to verify a token. The token itself contains the user's ID and roles, signed with a secret key.
- The API Gateway validates the JWT on every request and injects `X-User-Id` into the downstream request headers. Services use this header to know who made the request without re-validating the token.
- JWT tokens expire (configurable TTL), limiting the window of exposure if a token is leaked.
- Standard format — all Spring Security, React auth libraries, and tools like Postman understand JWTs natively.

**Problem it solves:** Without JWT, every service would need to call the User Service on every request to validate the session — creating a bottleneck and tight coupling. With JWT, validation is instant and local to the gateway.

---

### 17.12 Triple-DES (3DES) Encryption

**What it is:** A symmetric encryption algorithm that applies DES cipher three times to each data block. Used to encrypt PII (Personally Identifiable Information).

**Why we used it:**
- Passenger data — names, passport numbers, contact details — is sensitive. If the database is breached, encrypted PII is unreadable without the encryption key.
- 3DES is a well-understood, established algorithm with broad library support in Java.
- The `TripleDESEncryptor` in SkyWays encrypts fields like `passengerName` and `contactEmail` before they are persisted to PostgreSQL.
- The encryption key itself is never stored in code — it's fetched from environment variables, JVM properties, or GCP Secret Manager through the `SecretManagerService` cascade.

**Problem it solves:** Regulatory compliance (data privacy) and protection against database exposure. If the PostgreSQL dump is leaked, passenger PII remains protected.

---

### 17.13 Maven

**What it is:** A build automation tool for Java that manages dependencies, compilation, testing, and packaging.

**Why we used it:**
- Maven's `pom.xml` declares all dependencies (Spring Boot, Kafka, PostgreSQL driver, etc.) and Maven downloads and links them automatically.
- The SkyWays project is a **multi-module Maven project** — `skyways-common` is a shared library that all services depend on. Maven handles building it first and making it available to other modules.
- `mvn spring-boot:run` compiles and starts a service in one command — used in `start-skyways.bat`.
- Standard in Java enterprise development; works seamlessly with Spring Boot's parent POM.

**Problem it solves:** Manually managing JAR files for 50+ dependencies across 7 services would be unmanageable. Maven resolves transitive dependencies automatically and ensures consistent versions.

---

### 17.14 Spring Data JPA / Hibernate

**What it is:** Spring Data JPA is an abstraction over JPA (Java Persistence API). Hibernate is the JPA implementation (ORM — Object-Relational Mapper).

**Why we used it:**
- Hibernate maps Java classes (entities like `Booking`, `Flight`, `Seat`) directly to PostgreSQL tables. No manual SQL for basic CRUD operations.
- Spring Data JPA's `JpaRepository` provides `save()`, `findById()`, `findAll()` methods out of the box — no SQL needed for standard queries.
- Custom queries are written as method names (`findByBookingRef`, `findByUserId`) and Spring generates the SQL automatically.
- `@Transactional` annotation ensures database operations are wrapped in a transaction — if anything fails, everything rolls back atomically.
- Pessimistic locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) used in `SeatRepository` to prevent overbooking race conditions.

**Problem it solves:** Writing raw JDBC SQL for every database operation is verbose and error-prone. Hibernate lets us work with Java objects and handles the SQL translation, while still allowing raw SQL for performance-critical queries.

---

### 17.15 SAGA Orchestration Pattern

**What it is:** Not a technology but a distributed systems design pattern. The Saga Orchestrator is a dedicated microservice that coordinates multi-step transactions across services.

**Why we used it:**
- A flight booking involves 4 steps: create booking → reserve seat → process payment → confirm. These steps span 3 different services (Booking, Flight, Payment). A traditional database transaction cannot span multiple services.
- SAGA breaks the transaction into steps, each with a compensating action. If payment fails, the saga triggers seat release and booking cancellation automatically.
- The orchestrator (`SagaOrchestrationService`) tracks the state of every booking in the `saga_state` table — so if the server restarts mid-booking, the state is preserved and recoverable.
- Keeps services decoupled — Booking Service doesn't know about Payment Service; they only communicate through events via Kafka.

**Problem it solves:** Distributed transactions are the hardest problem in microservices. SAGA provides a structured, auditable way to handle partial failures without leaving the system in an inconsistent state (e.g., money charged but seat not reserved).

---

*Project: SkyWays Airlines*
*Team: Kezia and Yuvraj Mangla*
