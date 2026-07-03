# Plant Care App

Plant Care App je mobilna aplikacija za negu biljaka razvijena u React Native/Expo okruženju. Aplikacija omogućava korisniku da prati svoje biljke, njihove osnovne informacije, stanje i podatke koji se dobijaju preko senzora.

## Opis aplikacije

Cilj aplikacije je da korisniku olakša brigu o biljkama kroz pregled biljaka, praćenje parametara kao što su vlažnost zemljišta, temperatura i vlažnost vazduha, kao i kroz obaveštenja ili preporuke vezane za negu biljaka.

Aplikacija je namenjena korisnicima koji žele jednostavniji način za organizovanje i praćenje nege svojih biljaka.

## Korišćene tehnologije

- React Native
- Expo
- TypeScript
- Supabase
- Flask API
- ESP32 mikrokontroler
- Senzori za praćenje uslova okruženja

## Pokretanje projekta

Prvo je potrebno instalirati zavisnosti:

```bash
npm install
```

Zatim se aplikacija pokreće komandom:

```bash
npx expo start
```

Nakon pokretanja moguće je otvoriti aplikaciju pomoću:

- Expo Go aplikacije
- Android emulatora
- iOS simulatora
- web pregledača

## Struktura projekta

Glavni kod aplikacije nalazi se u folderu `app`.

Projekat koristi file-based routing preko Expo Router-a.

## Napomena

Za pokretanje aplikacije potrebno je podesiti odgovarajuće environment promenljive za povezivanje sa bazom podataka i API servisom.
