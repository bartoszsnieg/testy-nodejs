-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 03 Mar 2019, 17:32
-- Wersja serwera: 10.1.37-MariaDB
-- Wersja PHP: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE testynew DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `testynew`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `opcje`
--

CREATE TABLE `opcje` (
  `id` int(11) NOT NULL,
  `title` text COLLATE utf8_polish_ci NOT NULL,
  `content` text COLLATE utf8_polish_ci NOT NULL,
  `alternContent` text COLLATE utf8_polish_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `opcje`
--

INSERT INTO `opcje` (`id`, `title`, `content`, `alternContent`) VALUES
(6, 'rootLog', 'root', 'root');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `pytania`
--

CREATE TABLE `pytania` (
  `id` int(11) NOT NULL,
  `id_testu` int(11) NOT NULL,
  `tresc` longtext COLLATE utf8_polish_ci NOT NULL,
  `odpA` text COLLATE utf8_polish_ci NOT NULL,
  `odpB` text COLLATE utf8_polish_ci NOT NULL,
  `odpC` text COLLATE utf8_polish_ci NOT NULL,
  `odpD` text COLLATE utf8_polish_ci NOT NULL,
  `poprawna` int(11) NOT NULL,
  `imgW` int(11) DEFAULT NULL,
  `imgH` int(11) DEFAULT NULL,
  `imgSrc` text COLLATE utf8_polish_ci,
  `autor` text COLLATE utf8_polish_ci NOT NULL,
  `autorAdres` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `pytania`
--

INSERT INTO `pytania` (`id`, `id_testu`, `tresc`, `odpA`, `odpB`, `odpC`, `odpD`, `poprawna`, `imgW`, `imgH`, `imgSrc`, `autor`, `autorAdres`) VALUES
(10, 3, 'W języku JavaScript wynik działania instrukcji zmienna++; będzie taki sam jak instrukcji', 'zmienna = zmienna + 10;', 'zmienna === zmienna + 1;', 'zmienna += 1;', 'zmienna--;', 3, NULL, NULL, NULL, 'Anonim', 'Anonim'),
(11, 3, 'Wynik 3,5 uzyskany podczas pomiaru współczynnika fali stojącej w linii doprowadzającej do anteny nadawczej oznacza, że antena jest', 'idealnie dopasowana do linii zasilającej.', 'słabo dopasowana, ale może pracować ze zmniejszoną mocą.', 'dostatecznie dopasowana do linii zasilającej.', 'niedopasowana, co grozi uszkodzeniem stopnia końcowego nadajnika. ', 2, NULL, NULL, NULL, 'Anonim', 'Anonim'),
(13, 3, 'Do wyjścia układu o napięciu 10 V w celu uzyskania natężenia prądu 0,5 A należy podłączyć rezystor o parametrach:', '5 Ω, 2 W', '5 Ω, 20 W', '20 Ω, 1 W', '20 Ω, 10 W', 1, NULL, NULL, NULL, 'Bartek Śnieg', 'Bartek+Śnieg'),
(14, 3, 'Do obcięcia końcówek elementów po zalutowaniu stosuje się', 'szczypce boczne.', 'nóż monterski.', 'wkrętak.', 'pęsetę.', 1, NULL, NULL, NULL, 'Jan kowalski', 'Jan+kowalski'),
(15, 3, 'Sprawdzanie elementów przed montażem wykonuje się w celu', 'wyeliminowania wadliwych podzespołów.', 'uniknięcia odwróconego zamontowania.', 'uniknięcia zamiany elementów miejscami.', 'wyeliminowania zimnych lutów.', 4, NULL, NULL, NULL, 'Bartek Śnieg', 'Bartek+Śnieg');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `testy`
--

CREATE TABLE `testy` (
  `id` int(11) NOT NULL,
  `name` text COLLATE utf8_polish_ci NOT NULL,
  `ile` int(11) NOT NULL DEFAULT '0',
  `opis` longtext COLLATE utf8_polish_ci,
  `edit` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `testy`
--

INSERT INTO `testy` (`id`, `name`, `ile`, `opis`, `edit`) VALUES
(3, 'test1', 5, NULL, 0),
(4, 'e.13', 0, 'brak opisu jak myśliz będzie dzialać?:)', 0);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `opcje`
--
ALTER TABLE `opcje`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `pytania`
--
ALTER TABLE `pytania`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `testy`
--
ALTER TABLE `testy`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `opcje`
--
ALTER TABLE `opcje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT dla tabeli `pytania`
--
ALTER TABLE `pytania`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT dla tabeli `testy`
--
ALTER TABLE `testy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE USER 'nodejs'@'localhost' IDENTIFIED BY 'qwerty';
REVOKE ALL PRIVILEGES ON *.* FROM 'nodejs'@'localhost'; 
REVOKE GRANT OPTION ON *.* FROM 'nodejs'@'localhost'; 
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, FILE, INDEX, ALTER, CREATE TEMPORARY TABLES, CREATE VIEW, EVENT, TRIGGER, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EXECUTE ON *.* TO 'nodejs'@'localhost' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
