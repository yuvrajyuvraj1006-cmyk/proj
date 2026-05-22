-- Run as: psql -U skyways -h 127.0.0.1 -d flight_db -f seed-flights.sql
-- Password: skyways_pass

-- Clean existing seed data
DELETE FROM fare_classes WHERE flight_id IN (
    SELECT flight_id FROM flights WHERE airline_id = 'a0000000-0000-0000-0000-000000000001'
);
DELETE FROM flights    WHERE airline_id = 'a0000000-0000-0000-0000-000000000001';
DELETE FROM airlines   WHERE airline_id = 'a0000000-0000-0000-0000-000000000001';

-- ============================================================
-- AIRPORTS — Major airports worldwide
-- ============================================================
INSERT INTO airports (iata_code, name, city, country, timezone) VALUES
-- India
('DEL','Indira Gandhi International Airport','New Delhi','IN','Asia/Kolkata'),
('BOM','Chhatrapati Shivaji Maharaj International Airport','Mumbai','IN','Asia/Kolkata'),
('BLR','Kempegowda International Airport','Bengaluru','IN','Asia/Kolkata'),
('HYD','Rajiv Gandhi International Airport','Hyderabad','IN','Asia/Kolkata'),
('MAA','Chennai International Airport','Chennai','IN','Asia/Kolkata'),
('CCU','Netaji Subhas Chandra Bose International Airport','Kolkata','IN','Asia/Kolkata'),
('GOI','Goa International Airport','Goa','IN','Asia/Kolkata'),
('COK','Cochin International Airport','Kochi','IN','Asia/Kolkata'),
('AMD','Sardar Vallabhbhai Patel International Airport','Ahmedabad','IN','Asia/Kolkata'),
('PNQ','Pune Airport','Pune','IN','Asia/Kolkata'),
('JAI','Jaipur International Airport','Jaipur','IN','Asia/Kolkata'),
('LKO','Chaudhary Charan Singh International Airport','Lucknow','IN','Asia/Kolkata'),
('IXC','Chandigarh Airport','Chandigarh','IN','Asia/Kolkata'),
('NAG','Dr. Babasaheb Ambedkar International Airport','Nagpur','IN','Asia/Kolkata'),
('VNS','Lal Bahadur Shastri Airport','Varanasi','IN','Asia/Kolkata'),
('PAT','Jay Prakash Narayan Airport','Patna','IN','Asia/Kolkata'),
('IXZ','Veer Savarkar International Airport','Port Blair','IN','Asia/Kolkata'),
('STV','Surat Airport','Surat','IN','Asia/Kolkata'),
('BHO','Raja Bhoj Airport','Bhopal','IN','Asia/Kolkata'),
('IDR','Devi Ahilya Bai Holkar Airport','Indore','IN','Asia/Kolkata'),
('GAU','Lokpriya Gopinath Bordoloi International Airport','Guwahati','IN','Asia/Kolkata'),
('IXB','Bagdogra Airport','Siliguri','IN','Asia/Kolkata'),
('TRV','Trivandrum International Airport','Thiruvananthapuram','IN','Asia/Kolkata'),
('CJB','Coimbatore International Airport','Coimbatore','IN','Asia/Kolkata'),
('IXM','Madurai Airport','Madurai','IN','Asia/Kolkata'),
('VGA','Vijayawada Airport','Vijayawada','IN','Asia/Kolkata'),
('BDQ','Vadodara Airport','Vadodara','IN','Asia/Kolkata'),
('SXR','Sheikh ul-Alam International Airport','Srinagar','IN','Asia/Kolkata'),
('DIU','Diu Airport','Diu','IN','Asia/Kolkata'),
('JDH','Jodhpur Airport','Jodhpur','IN','Asia/Kolkata'),
('UDR','Maharana Pratap Airport','Udaipur','IN','Asia/Kolkata'),
-- Middle East
('DXB','Dubai International Airport','Dubai','AE','Asia/Dubai'),
('AUH','Abu Dhabi International Airport','Abu Dhabi','AE','Asia/Dubai'),
('SHJ','Sharjah International Airport','Sharjah','AE','Asia/Dubai'),
('DOH','Hamad International Airport','Doha','QA','Asia/Qatar'),
('KWI','Kuwait International Airport','Kuwait City','KW','Asia/Kuwait'),
('BAH','Bahrain International Airport','Manama','BH','Asia/Bahrain'),
('MCT','Muscat International Airport','Muscat','OM','Asia/Muscat'),
('AMM','Queen Alia International Airport','Amman','JO','Asia/Amman'),
('BEY','Beirut Rafic Hariri International Airport','Beirut','LB','Asia/Beirut'),
('RUH','King Khalid International Airport','Riyadh','SA','Asia/Riyadh'),
('JED','King Abdulaziz International Airport','Jeddah','SA','Asia/Riyadh'),
('TLV','Ben Gurion International Airport','Tel Aviv','IL','Asia/Jerusalem'),
-- South East Asia
('SIN','Changi Airport','Singapore','SG','Asia/Singapore'),
('KUL','Kuala Lumpur International Airport','Kuala Lumpur','MY','Asia/Kuala_Lumpur'),
('BKK','Suvarnabhumi Airport','Bangkok','TH','Asia/Bangkok'),
('CGK','Soekarno-Hatta International Airport','Jakarta','ID','Asia/Jakarta'),
('MNL','Ninoy Aquino International Airport','Manila','PH','Asia/Manila'),
('SGN','Tan Son Nhat International Airport','Ho Chi Minh City','VN','Asia/Ho_Chi_Minh'),
('HAN','Noi Bai International Airport','Hanoi','VN','Asia/Ho_Chi_Minh'),
('RGN','Yangon International Airport','Yangon','MM','Asia/Rangoon'),
('PNH','Phnom Penh International Airport','Phnom Penh','KH','Asia/Phnom_Penh'),
('VTE','Wattay International Airport','Vientiane','LA','Asia/Vientiane'),
('DPS','Ngurah Rai International Airport','Bali','ID','Asia/Makassar'),
('CMB','Bandaranaike International Airport','Colombo','LK','Asia/Colombo'),
('KTM','Tribhuvan International Airport','Kathmandu','NP','Asia/Kathmandu'),
('DAC','Hazrat Shahjalal International Airport','Dhaka','BD','Asia/Dhaka'),
-- East Asia
('NRT','Narita International Airport','Tokyo','JP','Asia/Tokyo'),
('HND','Haneda Airport','Tokyo','JP','Asia/Tokyo'),
('KIX','Kansai International Airport','Osaka','JP','Asia/Tokyo'),
('ICN','Incheon International Airport','Seoul','KR','Asia/Seoul'),
('PVG','Shanghai Pudong International Airport','Shanghai','CN','Asia/Shanghai'),
('PEK','Beijing Capital International Airport','Beijing','CN','Asia/Shanghai'),
('CAN','Guangzhou Baiyun International Airport','Guangzhou','CN','Asia/Shanghai'),
('CTU','Chengdu Tianfu International Airport','Chengdu','CN','Asia/Shanghai'),
('HKG','Hong Kong International Airport','Hong Kong','HK','Asia/Hong_Kong'),
('MFM','Macau International Airport','Macau','MO','Asia/Macau'),
('TPE','Taiwan Taoyuan International Airport','Taipei','TW','Asia/Taipei'),
('ULN','Chinggis Khaan International Airport','Ulaanbaatar','MN','Asia/Ulaanbaatar'),
-- South Asia
('KHI','Jinnah International Airport','Karachi','PK','Asia/Karachi'),
('LHE','Allama Iqbal International Airport','Lahore','PK','Asia/Karachi'),
('ISB','Islamabad International Airport','Islamabad','PK','Asia/Karachi'),
('MLE','Velana International Airport','Male','MV','Indian/Maldives'),
-- Europe
('LHR','Heathrow Airport','London','GB','Europe/London'),
('LGW','Gatwick Airport','London','GB','Europe/London'),
('MAN','Manchester Airport','Manchester','GB','Europe/London'),
('EDI','Edinburgh Airport','Edinburgh','GB','Europe/London'),
('CDG','Charles de Gaulle Airport','Paris','FR','Europe/Paris'),
('ORY','Paris Orly Airport','Paris','FR','Europe/Paris'),
('AMS','Amsterdam Schiphol Airport','Amsterdam','NL','Europe/Amsterdam'),
('FRA','Frankfurt Airport','Frankfurt','DE','Europe/Berlin'),
('MUC','Munich Airport','Munich','DE','Europe/Berlin'),
('BER','Berlin Brandenburg Airport','Berlin','DE','Europe/Berlin'),
('ZRH','Zurich Airport','Zurich','CH','Europe/Zurich'),
('GVA','Geneva Airport','Geneva','CH','Europe/Zurich'),
('VIE','Vienna International Airport','Vienna','AT','Europe/Vienna'),
('BCN','Barcelona El Prat Airport','Barcelona','ES','Europe/Madrid'),
('MAD','Adolfo Suarez Madrid Barajas Airport','Madrid','ES','Europe/Madrid'),
('FCO','Leonardo da Vinci International Airport','Rome','IT','Europe/Rome'),
('MXP','Milan Malpensa Airport','Milan','IT','Europe/Rome'),
('ATH','Athens International Airport','Athens','GR','Europe/Athens'),
('IST','Istanbul Airport','Istanbul','TR','Europe/Istanbul'),
('SVO','Sheremetyevo International Airport','Moscow','RU','Europe/Moscow'),
('DME','Domodedovo International Airport','Moscow','RU','Europe/Moscow'),
('LED','Pulkovo Airport','St. Petersburg','RU','Europe/Moscow'),
('WAW','Warsaw Chopin Airport','Warsaw','PL','Europe/Warsaw'),
('PRG','Vaclav Havel Airport Prague','Prague','CZ','Europe/Prague'),
('BUD','Budapest Ferenc Liszt International Airport','Budapest','HU','Europe/Budapest'),
('ARN','Stockholm Arlanda Airport','Stockholm','SE','Europe/Stockholm'),
('CPH','Copenhagen Airport','Copenhagen','DK','Europe/Copenhagen'),
('OSL','Oslo Gardermoen Airport','Oslo','NO','Europe/Oslo'),
('HEL','Helsinki Vantaa Airport','Helsinki','FI','Europe/Helsinki'),
('LIS','Humberto Delgado Airport','Lisbon','PT','Europe/Lisbon'),
('DUB','Dublin Airport','Dublin','IE','Europe/Dublin'),
('BRU','Brussels Airport','Brussels','BE','Europe/Brussels'),
('LUX','Luxembourg Airport','Luxembourg','LU','Europe/Luxembourg'),
-- North America
('JFK','John F. Kennedy International Airport','New York','US','America/New_York'),
('LGA','LaGuardia Airport','New York','US','America/New_York'),
('EWR','Newark Liberty International Airport','Newark','US','America/New_York'),
('ORD','O Hare International Airport','Chicago','US','America/Chicago'),
('MDW','Chicago Midway International Airport','Chicago','US','America/Chicago'),
('LAX','Los Angeles International Airport','Los Angeles','US','America/Los_Angeles'),
('SFO','San Francisco International Airport','San Francisco','US','America/Los_Angeles'),
('SEA','Seattle-Tacoma International Airport','Seattle','US','America/Los_Angeles'),
('DFW','Dallas Fort Worth International Airport','Dallas','US','America/Chicago'),
('IAH','George Bush Intercontinental Airport','Houston','US','America/Chicago'),
('MIA','Miami International Airport','Miami','US','America/New_York'),
('ATL','Hartsfield-Jackson Atlanta International Airport','Atlanta','US','America/New_York'),
('BOS','Logan International Airport','Boston','US','America/New_York'),
('DCA','Ronald Reagan Washington National Airport','Washington DC','US','America/New_York'),
('IAD','Washington Dulles International Airport','Washington DC','US','America/New_York'),
('DEN','Denver International Airport','Denver','US','America/Denver'),
('PHX','Phoenix Sky Harbor International Airport','Phoenix','US','America/Phoenix'),
('LAS','Harry Reid International Airport','Las Vegas','US','America/Los_Angeles'),
('MSP','Minneapolis-Saint Paul International Airport','Minneapolis','US','America/Chicago'),
('DTW','Detroit Metropolitan Wayne County Airport','Detroit','US','America/Detroit'),
('CLT','Charlotte Douglas International Airport','Charlotte','US','America/New_York'),
('YYZ','Toronto Pearson International Airport','Toronto','CA','America/Toronto'),
('YVR','Vancouver International Airport','Vancouver','CA','America/Vancouver'),
('YUL','Montreal Pierre Elliott Trudeau International Airport','Montreal','CA','America/Toronto'),
('YYC','Calgary International Airport','Calgary','CA','America/Edmonton'),
('MEX','Mexico City International Airport','Mexico City','MX','America/Mexico_City'),
('CUN','Cancun International Airport','Cancun','MX','America/Cancun'),
('GDL','Miguel Hidalgo y Costilla International Airport','Guadalajara','MX','America/Mexico_City'),
-- South America
('GRU','Sao Paulo Guarulhos International Airport','Sao Paulo','BR','America/Sao_Paulo'),
('GIG','Rio de Janeiro Galeao International Airport','Rio de Janeiro','BR','America/Sao_Paulo'),
('EZE','Ministro Pistarini International Airport','Buenos Aires','AR','America/Argentina/Buenos_Aires'),
('SCL','Arturo Merino Benitez International Airport','Santiago','CL','America/Santiago'),
('BOG','El Dorado International Airport','Bogota','CO','America/Bogota'),
('LIM','Jorge Chavez International Airport','Lima','PE','America/Lima'),
('UIO','Mariscal Sucre International Airport','Quito','EC','America/Guayaquil'),
('CCS','Simon Bolivar International Airport','Caracas','VE','America/Caracas'),
-- Africa
('JNB','O.R. Tambo International Airport','Johannesburg','ZA','Africa/Johannesburg'),
('CPT','Cape Town International Airport','Cape Town','ZA','Africa/Johannesburg'),
('CAI','Cairo International Airport','Cairo','EG','Africa/Cairo'),
('CMN','Mohammed V International Airport','Casablanca','MA','Africa/Casablanca'),
('ADD','Addis Ababa Bole International Airport','Addis Ababa','ET','Africa/Addis_Ababa'),
('NBO','Jomo Kenyatta International Airport','Nairobi','KE','Africa/Nairobi'),
('LOS','Murtala Muhammed International Airport','Lagos','NG','Africa/Lagos'),
('ABV','Nnamdi Azikiwe International Airport','Abuja','NG','Africa/Lagos'),
('ACC','Kotoka International Airport','Accra','GH','Africa/Accra'),
('DAR','Julius Nyerere International Airport','Dar es Salaam','TZ','Africa/Dar_es_Salaam'),
('TUN','Tunis Carthage International Airport','Tunis','TN','Africa/Tunis'),
('ALG','Houari Boumediene Airport','Algiers','DZ','Africa/Algiers'),
-- Australia & Pacific
('SYD','Sydney Kingsford Smith Airport','Sydney','AU','Australia/Sydney'),
('MEL','Melbourne Airport','Melbourne','AU','Australia/Melbourne'),
('BNE','Brisbane Airport','Brisbane','AU','Australia/Brisbane'),
('PER','Perth Airport','Perth','AU','Australia/Perth'),
('ADL','Adelaide Airport','Adelaide','AU','Australia/Adelaide'),
('AKL','Auckland Airport','Auckland','NZ','Pacific/Auckland'),
('CHC','Christchurch Airport','Christchurch','NZ','Pacific/Auckland'),
('NAN','Nadi International Airport','Nadi','FJ','Pacific/Fiji'),
('PPT','Faa International Airport','Papeete','PF','Pacific/Tahiti')
ON CONFLICT (iata_code) DO NOTHING;

-- Airline
INSERT INTO airlines (airline_id, iata_code, name, country)
VALUES ('a0000000-0000-0000-0000-000000000001', 'SW', 'SkyWays Airlines', 'IN');

-- Sample flights with explicit UUIDs
INSERT INTO flights (flight_id, airline_id, flight_number, origin_iata, destination_iata,
                     departure_time, arrival_time, status, total_seats, available_seats)
VALUES
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-101','DEL','BOM','2026-06-01 04:30:00+05:30','2026-06-01 06:45:00+05:30','SCHEDULED',180,145),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-102','BOM','DEL','2026-06-01 09:00:00+05:30','2026-06-01 11:15:00+05:30','SCHEDULED',180,120),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-201','DEL','BLR','2026-06-01 07:00:00+05:30','2026-06-01 09:45:00+05:30','SCHEDULED',160,95),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-202','BLR','DEL','2026-06-01 11:00:00+05:30','2026-06-01 13:45:00+05:30','SCHEDULED',160,88),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-301','DEL','LHR','2026-06-01 02:00:00+05:30','2026-06-01 10:30:00+00:00','SCHEDULED',320,210),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-401','BOM','DXB','2026-06-01 23:30:00+05:30','2026-06-02 01:00:00+04:00','SCHEDULED',250,175),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-501','DEL','BOM','2026-06-02 06:00:00+05:30','2026-06-02 08:15:00+05:30','SCHEDULED',180,160),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-601','DEL','BLR','2026-06-02 14:00:00+05:30','2026-06-02 16:45:00+05:30','SCHEDULED',160,110),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-701','BOM','BLR','2026-06-01 08:00:00+05:30','2026-06-01 09:15:00+05:30','SCHEDULED',140,90),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-801','DEL','GOI','2026-06-01 10:00:00+05:30','2026-06-01 12:30:00+05:30','SCHEDULED',150,75),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-901','HYD','DEL','2026-06-01 07:30:00+05:30','2026-06-01 09:45:00+05:30','SCHEDULED',160,130),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-111','DEL','DXB','2026-06-01 05:00:00+05:30','2026-06-01 07:30:00+04:00','SCHEDULED',280,200),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-121','BOM','SIN','2026-06-01 06:00:00+05:30','2026-06-01 14:30:00+08:00','SCHEDULED',200,150),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-131','DEL','SIN','2026-06-01 08:00:00+05:30','2026-06-01 16:30:00+08:00','SCHEDULED',200,120),
    (gen_random_uuid(),'a0000000-0000-0000-0000-000000000001','SW-141','DEL','JFK','2026-06-01 01:00:00+05:30','2026-06-01 10:00:00-05:00','SCHEDULED',350,280);

-- Fare classes
INSERT INTO fare_classes (fare_id, flight_id, class_type, base_price, currency, available)
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  2499,  'INR', available_seats FROM flights WHERE flight_number = 'SW-101' UNION ALL
SELECT gen_random_uuid(), flight_id, 'BUSINESS', 7999,  'INR', 20              FROM flights WHERE flight_number = 'SW-101' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  2499,  'INR', available_seats FROM flights WHERE flight_number = 'SW-102' UNION ALL
SELECT gen_random_uuid(), flight_id, 'BUSINESS', 7999,  'INR', 20              FROM flights WHERE flight_number = 'SW-102' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  2999,  'INR', available_seats FROM flights WHERE flight_number = 'SW-201' UNION ALL
SELECT gen_random_uuid(), flight_id, 'BUSINESS', 8999,  'INR', 20              FROM flights WHERE flight_number = 'SW-201' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  2999,  'INR', available_seats FROM flights WHERE flight_number = 'SW-202' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  45999, 'INR', available_seats FROM flights WHERE flight_number = 'SW-301' UNION ALL
SELECT gen_random_uuid(), flight_id, 'BUSINESS', 95000, 'INR', 30              FROM flights WHERE flight_number = 'SW-301' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  18999, 'INR', available_seats FROM flights WHERE flight_number = 'SW-401' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  2799,  'INR', available_seats FROM flights WHERE flight_number = 'SW-501' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  3199,  'INR', available_seats FROM flights WHERE flight_number = 'SW-601' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  1899,  'INR', available_seats FROM flights WHERE flight_number = 'SW-701' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  3499,  'INR', available_seats FROM flights WHERE flight_number = 'SW-801' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  2799,  'INR', available_seats FROM flights WHERE flight_number = 'SW-901' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  12999, 'INR', available_seats FROM flights WHERE flight_number = 'SW-111' UNION ALL
SELECT gen_random_uuid(), flight_id, 'BUSINESS', 35000, 'INR', 30              FROM flights WHERE flight_number = 'SW-111' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  22999, 'INR', available_seats FROM flights WHERE flight_number = 'SW-121' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  24999, 'INR', available_seats FROM flights WHERE flight_number = 'SW-131' UNION ALL
SELECT gen_random_uuid(), flight_id, 'ECONOMY',  55999, 'INR', available_seats FROM flights WHERE flight_number = 'SW-141' UNION ALL
SELECT gen_random_uuid(), flight_id, 'BUSINESS', 150000,'INR', 30              FROM flights WHERE flight_number = 'SW-141';
