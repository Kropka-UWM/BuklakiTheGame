# Aktualizacja i porównanie działania — 14 października 2026

Punkt wyjścia: `d2205ad2a2c6b19d0c2d465c77ee71c26a7018bf` na `master`.
Repozytorium miało 104 commity, jedną zdalną gałąź i nie miało tagów.
Testy starego kodu wykonano w osobnym checkoutcie z oryginalnym lockfile.

## Zależności

| Biblioteka | Stara wersja | Nowa wersja |
| --- | --- | --- |
| Electron | 22.0.3 | 44.7.2 |
| electron-builder | 23.6.0 | 26.15.3 |
| jQuery | 3.6.0, plik w repo | 4.0.0 |
| Bootstrap | 5.1.3, pliki w repo | 5.3.8, bundle z Popperem |
| js-cookie | 3.0.1, plik w repo | 3.0.8 |
| Django | 5.1.3 | 6.1.2 |
| django-cors-headers | 4.6.0 | 4.9.0 |
| asgiref | nieprzypięta zależność pośrednia | 3.12.1 |
| sqlparse | nieprzypięta zależność pośrednia | 0.6.0 |
| AndroidJS | 2.0.4 | usunięty, nieużywany |
| Playwright Test | brak | 1.64.0 |

To najnowsze stabilne wersje odczytane z npm i PyPI w dniu testowania.
AndroidJS 2.0.6 również sprawdzono, ale nadal wnosił podatne, przestarzałe
Socket.IO 2; żadna część gry nie importowała tego frameworka.

Migracja jQuery wymagała zastąpienia usuniętych skrótów zdarzeń przez `.on()`
i `.trigger()`. Zmiany opisuje [oficjalny przewodnik jQuery 4](https://jquery.com/upgrade-guide/4.0/).
Nowe wymagania Django opisują [release notes Django 6.1](https://docs.djangoproject.com/en/6.1/releases/6.1/).
Lokalny protokół Electrona korzysta z [oficjalnego API protocol](https://www.electronjs.org/docs/latest/api/protocol).

## Porównanie testów

| Zestaw | Stara wersja | Nowa wersja |
| --- | --- | --- |
| API Django: 8 przypadków | 8/8 | 8/8 |
| Wspólne scenariusze przeglądarkowe | 8/8 | 8/8 |
| Nowe scenariusze przeglądarkowe | nie dotyczy | 3/3 |
| Wspólne scenariusze Electron | 2/4 | 4/4 |
| Restart Electrona i trwałość ustawień | nie dotyczy | 1/1 |
| Zbudowana aplikacja macOS arm64 | nie sprawdzano | 5/5 |
| `manage.py check` | OK | OK |
| `makemigrations --check --dry-run` | brak zmian | brak zmian |

Wspólne scenariusze gry obejmują menu, instrukcję i powrót klawiaturą,
zmianę dystansu i liczby bukłaków, tłumaczenie na angielski, ruch i
uzupełnienie wody w oazie, zakopywanie i odzyskiwanie wody, pauzę,
przegraną oraz wygraną na krótkiej trasie z wynikiem 3 dni.

API sprawdzono dla pustego rankingu, zapisu i odczytu wyniku, starego
odczytu przez POST, limitu siedmiu rekordów, odrzucenia GET przy zapisie,
brakujących pól, błędnej liczby i CORS dla pochodzenia `null`.

Dwa rzeczywiste błędy starego Electrona odtworzono przed poprawkami:

- Zmiana dystansu z 8 na 2 w menu nie przechodziła do gry ładowanej przez
  `file://`; gra nadal tworzyła 8 pól. Nowy standardowy protokół i Web
  Storage zapewniają wspólne, trwałe ustawienia.
- Ranking żądał pliku `/buklakithebackend/get-records/` w lokalnym systemie
  plików. Nowy konfigurowalny adres HTTP dociera do właściwego API Django.

Nowe testy potwierdzają także wyświetlanie nazw graczy jako tekstu,
oczekiwanie na zapis przed powrotem do menu, pozostawienie wyniku po
odrzuceniu zapisu i skuteczną ponowną próbę. Testy desktopowe wysyłają
rzeczywiste HTTP do Django i sprawdzają zapisany rekord; test restartu
zamyka i ponownie uruchamia proces aplikacji z tym samym profilem.

Nowa wersja przechodzi 24 testy automatyczne oraz dodatkowo 5 testów
zbudowanej aplikacji. Mechaniki i wyników gry nie zmieniano.

## Audyty i ograniczenia

| Audyt | Przed | Po |
| --- | --- | --- |
| npm, całość | 38 zgłoszeń: 2 critical, 23 high, 10 moderate, 3 low | 8 moderate, tylko narzędzia budowania |
| npm, zależności produkcyjne | były podatności AndroidJS/Socket.IO | 0 |
| Python, przypięte zależności projektu | 37 zgłoszeń w Django 5.1.3 | 0 |

Pozostałe 8 pozycji npm wynika z jednego problemu `sprintf-js`, pośrednio
przez `roarr`, `global-agent` i `@electron/get` w electron-builder.
Audyt proponuje cofnięcie buildera do 26.5.0. Zachowano najnowszy 26.15.3
bez nieprzetestowanych nadpisań głównych wersji zależności.

Środowisko: macOS arm64, Node.js 26.11.1, Python 3.12.14 dla starego kodu,
Python 3.14.8 dla nowego, lokalny Chrome do testów przeglądarkowych.
Zbudowano i uruchomiono paczkę macOS arm64, bez podpisu dystrybucyjnego.
Windows, Android i ręczny odsłuch muzyki nie były testowane. Opcja
„Rozwiąż i zakończ” pozostaje niezaimplementowana tak jak w starej wersji.

GitHub Actions dodaje oddzielny zestaw testów na Linux z Node.js 24 i
Pythonem 3.14, włącznie z budowaniem. Wynik zdalnego workflow należy
sprawdzić w zakładce Actions po publikacji.

## Historia Git

Wszystkim 105 osiągalnym commitom gałęzi `master` (104 wcześniejszym i
jednemu z aktualizacją) ustawiono autora i committera
`memegauste <memegauste@gmail.com>`. Przepisanie zmieniło ich SHA i usunęło
podpisy commitów. Weryfikacja potwierdziła identyczne drzewa plików, daty,
opisy i topologię istniejących 104 commitów względem kopii sprzed operacji.

Oryginalna historia jest zachowana w zewnętrznej kopii
`BuklakiTheGame-original.bundle`. Po przepisaniu współpracownicy powinni
sklonować repozytorium ponownie lub świadomie wyrównać lokalne gałęzie.
Wewnętrzne odnośniki GitHub do dawnych pull requestów mogą nadal zawierać
stare commity; tych referencji serwerowych nie można nadpisać zwykłym pushem.
