![django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![python](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)
![jquery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)

# BuklakiTheGame [Projekt zespołowy UWM]
### Skład zespołu:
* Mateusz Szczygłów
* Grzegorz Choczaj
* Patryk Szczepański
* Dawid Zagórski
* Krzysztof Wysocki
* Przemysław Samsel

## Uruchomienie

Wymagania: Node.js >= 22.12 i Python >= 3.12. Lokalnie sprawdzono Node.js
26.11.1 oraz Python 3.14.8. CI używa Node.js 24 i Pythona 3.14.

```sh
npm ci
npm run vendor:sync
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r buklakithebackend/requirements.txt
python buklakithebackend/manage.py migrate
python buklakithebackend/manage.py runserver 127.0.0.1:8000
```

Na Windows aktywuj środowisko poleceniem `.venv\Scripts\Activate.ps1`.
W drugim terminalu uruchom `npm start`. Gra działa także bez backendu;
ranking i zapis wyników wymagają działającego Django.

Adres API ustawia znacznik `meta[name="backend-url"]` w `main.html` i
`game.html` (domyślnie `http://127.0.0.1:8000/`). Przy wdrożeniu pod prefiksem
URL wpisz adres z tym prefiksem w obu plikach.

Electron korzysta z lokalnego protokołu `buklaki://game/`, dzięki czemu
ustawienia zapisane w Web Storage są wspólne dla menu i gry oraz zachowane
po restarcie. Wersja przeglądarkowa odczytuje także wcześniejsze cookies.

## Testy

```sh
python buklakithebackend/manage.py test handler
python buklakithebackend/manage.py check
python buklakithebackend/manage.py makemigrations --check --dry-run
npx playwright install chromium
npm test
npm run test:electron
```

Do `test:electron` aktywuj środowisko Pythona lub ustaw `PYTHON_BIN` na jego
plik wykonywalny. Testy same uruchamiają Django na porcie 8000 i tworzą
oddzielną, tymczasową bazę; zatrzymaj wcześniej lokalny serwer developerski.
Na Linux bez ekranu użyj `xvfb-run --auto-servernum npm run test:electron`.
Opcjonalny `CHROME_PATH` pozwala użyć lokalnego Chrome zamiast Chromium
Playwrighta. `ELECTRON_PATH` pozwala sprawdzić już zbudowaną aplikację.

Workflow `.github/workflows/test.yml` wykonuje testy API, przeglądarki,
Electrona i budowanie paczki Linux po każdym pushu oraz dla pull requestów.

## Budowanie

```sh
npm run build:dir
npm run build
```

Pliki trafiają do `dist/`. `build:dir` tworzy aplikację bez instalatora;
`build` tworzy domyślne pakiety dla bieżącego systemu. Przykładowo na macOS:
`npm run build:dir -- --mac --arm64`. Publikacja podpisanego instalatora
macOS wymaga własnego certyfikatu i konfiguracji podpisu.

Biblioteki frontendu są przypięte w `package-lock.json`, a ich lokalne kopie
w `static/` odtwarza `npm run vendor:sync`. AndroidJS usunięto, ponieważ nie
był używany i wprowadzał podatne biblioteki Socket.IO 2. Projekt nie ma
zaimplementowanego celu Android.

Wyniki porównania starej i nowej wersji: [raport testów](docs/verification-2026-10-14.md).
