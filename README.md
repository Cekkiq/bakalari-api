# Bakaláři API

Tento repozitář obsahuje API pro přístup a interakci se systémem Bakaláři. API jsou organizována v adresáři `/api/` a strukturována podle konkrétního API a typů dostupných dat.

## Konfigurace API

V každém souboru se nacházejí tyto řádky:

```
const USERNAME = "";
const PASSWORD = "";
```

Potřebuješ abys do "" doplnil tvé údaje do bakalářů

A dál zde je řádek:
```
const BASE_URL = "https://tvojeskola.bakalari.cz/api";
```
Kde místo tvojeskola doplníš url pro tvojí Školu

## API Endpointy

Většina endpointu je na ``` /api/(název api)/(pokud má api víc typu tak sou zde) ```
