-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 06 Apr 2026 pada 11.15
-- Versi server: 10.4.27-MariaDB
-- Versi PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cserm_unas`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','superadmin') DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(2, 'admin19', '$2b$10$G7CWE8W6avUqC9TcwnGGneodR9T1t9/5I2EXhbVLbacqaG6tw1ltW', 'admin', '2026-02-18 09:38:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `homepage_aims`
--

CREATE TABLE `homepage_aims` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `order_number` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `homepage_aims`
--

INSERT INTO `homepage_aims` (`id`, `content`, `image`, `order_number`, `is_active`, `created_at`) VALUES
(2, 'dfffdd', 'aims/1772815263943-602401465.jpg', 1, 1, '2026-03-06 16:41:03'),
(3, 'test', 'aims/1773643209921-577006566.png', 1, 1, '2026-03-16 06:40:09');

-- --------------------------------------------------------

--
-- Struktur dari tabel `homepage_hero`
--

CREATE TABLE `homepage_hero` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `order_number` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `homepage_hero`
--

INSERT INTO `homepage_hero` (`id`, `image`, `caption`, `order_number`, `is_active`, `created_at`, `updated_at`) VALUES
(3, 'hero/1772552053244-984159883.webp', NULL, 1, 1, '2026-03-03 15:34:13', '2026-03-03 15:34:13'),
(4, 'hero/1774529378936-15886513.jpg', NULL, 1, 1, '2026-03-26 12:49:38', '2026-03-26 12:49:38');

-- --------------------------------------------------------

--
-- Struktur dari tabel `homepage_profile`
--

CREATE TABLE `homepage_profile` (
  `id` int(11) NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `homepage_profile`
--

INSERT INTO `homepage_profile` (`id`, `title`, `description`, `updated_at`) VALUES
(1, 'tesst', 'test123', '2026-03-16 06:37:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `homepage_vision_mission`
--

CREATE TABLE `homepage_vision_mission` (
  `id` int(11) NOT NULL DEFAULT 1,
  `vision_title` varchar(120) DEFAULT 'Vision',
  `vision_text` text NOT NULL,
  `mission_title` varchar(120) DEFAULT 'Mission',
  `mission_text` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `homepage_vision_mission`
--

INSERT INTO `homepage_vision_mission` (`id`, `vision_title`, `vision_text`, `mission_title`, `mission_text`, `image`, `updated_at`) VALUES
(1, 'visi test', 'test', 'Mission', 'asdsd', 'vision/1773643272998-753441566.jpg', '2026-03-16 06:41:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('published','draft') DEFAULT 'published'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `image`, `created_at`, `status`) VALUES
(1, 'anjay', 'dfsfd', '1771425883983.jpeg', '2026-02-18 14:44:44', 'published'),
(5, 'test', 'twst', 'news/1773643744982-49262211.jpg', '2026-03-16 06:49:05', 'published'),
(6, 'test', 'test', 'news/1773643769632-340251161.jpg', '2026-03-16 06:49:29', 'published'),
(7, 'test', 'test', 'news/1773643782317-88121569.webp', '2026-03-16 06:49:42', 'published'),
(8, 'test', 'test', 'news/1773643794881-891810375.jpg', '2026-03-16 06:49:54', 'published'),
(9, 'test', 'test', 'news/1773644252762-51696062.png', '2026-03-16 06:57:32', 'published'),
(10, 'coba baru', 'coba lagi', 'news/1774528282894-756190306.png', '2026-03-26 12:31:22', 'published'),
(11, 'sdasd', 'sdasd', 'news/1774631384011-546724517.png', '2026-03-27 17:09:44', 'published'),
(13, 'dasdcvcv', 'ssdasdasd123', 'news/1774631463995-564808967.webp', '2026-03-27 17:11:03', 'published'),
(14, 'coba judul', 'coba konten', 'news/1774689653631-951892609.webp', '2026-03-28 09:20:53', 'published');

-- --------------------------------------------------------

--
-- Struktur dari tabel `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `short_description` text NOT NULL,
  `full_description` longtext DEFAULT NULL,
  `external_link` varchar(500) DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `project_date` varchar(100) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `order_number` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `projects`
--

INSERT INTO `projects` (`id`, `title`, `slug`, `short_description`, `full_description`, `external_link`, `featured_image`, `location`, `project_date`, `is_featured`, `is_active`, `order_number`, `created_at`, `updated_at`) VALUES
(14, 'coba1', 'coba lagi', 'cobaaaaa', 'asdf', 'https://www.youtube.com/watch?v=gjOleiHXYLc', 'projects/1774882438504-737887910.png', 'jabar', '2025', 0, 1, 1, '2026-03-24 15:21:44', '2026-03-30 14:53:58'),
(18, 'lagi', 'asdfsdfdvcv', 'asdafdsfdsF', 'sdfsdfasdddfsd', 'https://www.youtube.com/watch?v=PadKCVBIN94&list=RDMMOqEc_169ywY&index=14', NULL, 'sulawesit', '2024', 0, 1, 1, '2026-03-24 17:55:35', '2026-03-27 19:33:28'),
(19, 'coba', NULL, 'pendek', 'panjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjang', 'https://www.youtube.com/watch?v=PadKCVBIN94&list=RDMMOqEc_169ywY&index=14', 'projects/1774641954603-431067492.png', 'ngawi', '2024', 0, 1, 1, '2026-03-27 20:05:54', '2026-03-27 20:05:54'),
(20, 'coba title', NULL, 'coba short', 'coba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba fullcoba full', 'https://www.youtube.com/watch?v=PadKCVBIN94&list=RDMMOqEc_169ywY&index=14', NULL, 'ngawi', '2024', 0, 1, 1, '2026-03-28 09:15:47', '2026-03-28 09:15:47'),
(21, 'cobaa', NULL, 'coba', 'cobacobacobacobacobacobacobacobacobacobacobacobacobacobacobacobacobacobacobacobacobacobacoba', NULL, NULL, 'mojokerto', '19 januari 2025', 0, 1, 1, '2026-03-28 15:17:01', '2026-03-28 15:17:01');

-- --------------------------------------------------------

--
-- Struktur dari tabel `project_blocks`
--

CREATE TABLE `project_blocks` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `layout_type` enum('text-left-image-right','image-left-text-right') NOT NULL DEFAULT 'text-left-image-right',
  `image_style` enum('rounded-full','rounded-2xl','rounded-xl') NOT NULL DEFAULT 'rounded-2xl',
  `order_number` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `project_page_settings`
--

CREATE TABLE `project_page_settings` (
  `id` int(11) NOT NULL,
  `hero_image` varchar(255) DEFAULT NULL,
  `page_title` varchar(255) NOT NULL DEFAULT 'Recent Project',
  `page_subtitle` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `project_page_settings`
--

INSERT INTO `project_page_settings` (`id`, `hero_image`, `page_title`, `page_subtitle`, `updated_at`) VALUES
(1, 'projects/1774882356918-758504798.png', 'coba', 'coba123', '2026-03-30 14:52:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `publications`
--

CREATE TABLE `publications` (
  `id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `authors` text NOT NULL,
  `title` text NOT NULL,
  `journal` text DEFAULT NULL,
  `url` text NOT NULL,
  `doi` varchar(120) DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `publications`
--

INSERT INTO `publications` (`id`, `year`, `authors`, `title`, `journal`, `url`, `doi`, `keywords`, `created_at`) VALUES
(2, 2026, 'ds', 'test', 'Polycentricity in practice: Marine governance transitions in Southeast Asia Fortnam et al., Environmental Science and Policy  Building bridges between natural and social science disciplines: a standardized methodology to combine data on ecosystem quality trends Richter et al., Philosophical Transactions B  The health status of coral reef ecosystem in Taka Bonerate, Kepulauan Selaya Biosphere Reserve, Indonesia Wulandari et al., Biodiversitas  Socio-economic analysis of renewable energy based on community at small isolated island in Indonesia Agnia et al., Eur. Conf. Ren. Energy Sys', 'test.com', 'tes.com', NULL, '2026-03-16 06:34:02'),
(3, 2023, 'kosaldasd', 'asdasf', 'asds', 'https://www.youtube.com/watch?v=jEQHYSdzEdg', NULL, NULL, '2026-03-24 19:30:04'),
(4, 2020, 'tesrt', 'test', 'jurnal a', 'https://www.youtube.com/watch?v=elvdDa9gKWo&t=3471s', 'https://www.youtube.com/watch?v=elvdDa9gKWo&t=3471s', NULL, '2026-03-26 12:22:08'),
(5, 2026, 'jokowi', 'manusia setengah dewa', 'Polycentricity in practice: Marine governance transitions in Southeast Asia Fortnam et al., Environmental Science and Policy Building bridges between natural and social science disciplines: a standardized methodology to combine data on ecosystem quality trends Richter et al., Philosophical Transactions B The health status of coral reef ecosystem in Taka Bonerate, Kepulauan Selaya Biosphere Reserve, Indonesia Wulandari et al., Biodiversitas Socio-economic analysis of renewable energy based on community at small isolated island in Indonesia Agnia et al., Eur. Conf. Ren. Energy Sys View DOI', 'https://www.youtube.com/watch?v=JRfuAukYTKg&list=TLPQMjcwMzIwMjbn_sI2IjDXcQ&index=5', NULL, NULL, '2026-03-27 19:36:47'),
(6, 2026, '<b>coba bold author</b>', 'test123', 'testjjjj', 'https://www.youtube.com/', NULL, 'coba keywords\n', '2026-03-28 08:23:34'),
(7, 2026, '<b>coba lagi</b>', 'cobaa test123', 'panjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangpanjangv', 'https://www.youtube.com/watch?v=Gwfro0GNBUw&list=RDO9wqqT7-KI0&index=4', NULL, 'coba keyword lagi12', '2026-03-28 08:56:49'),
(8, 2026, '<b>alif</b>, coba, coba2', 'test judul', 'contoh jurnal', 'www.youtube.com', 'www.youtube.com', 'coba keywords', '2026-03-28 09:07:51'),
(9, 2026, 'aselolee', 'test judul123', ' jurnal contohjurnal contohjurnal contohjurnal contoh', 'https://www.youtube.com/watch?v=w7BrZCkC8ag', NULL, 'test', '2026-03-28 14:06:07'),
(10, 2023, 'aseloleee', 'test39', 'jurnal contohjurnal contohjurnal contohjurnal contohjurnal contohjurnal contohjurnal contoh', 'https://www.youtube.com/watch?v=w7BrZCkC8ag', NULL, 'yt', '2026-03-28 14:07:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `position` varchar(150) NOT NULL,
  `bio` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` enum('management','staff','expert') NOT NULL DEFAULT 'staff'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `teams`
--

INSERT INTO `teams` (`id`, `name`, `position`, `bio`, `photo`, `created_at`, `category`) VALUES
(7, 'jokowi', 'ceo', 'asdasd', '1774610963369.png', '2026-03-27 11:29:23', ''),
(10, 'plenger', 'test', 'sd', '1774612032801.webp', '2026-03-27 11:47:12', 'expert'),
(11, 'test lagi', 'adalah', NULL, '1774612620190.png', '2026-03-27 11:57:00', 'management'),
(12, 'aselolee', 'asdf', NULL, '1774612671346.jpg', '2026-03-27 11:57:51', 'staff'),
(13, 'ngkong pian', 'asdf', NULL, '1774710106663.png', '2026-03-28 15:01:46', 'staff'),
(14, 'coba staf2', 'assad', NULL, NULL, '2026-03-28 15:03:02', 'staff'),
(15, 'coba lagi', 'asdf', NULL, NULL, '2026-03-28 15:08:08', 'staff'),
(16, 'cobalagi3', 'asdsafd', NULL, NULL, '2026-03-28 15:08:17', 'staff'),
(17, 'cobalagi5', 'sdfdsfjsd', NULL, NULL, '2026-03-28 15:08:26', 'staff'),
(18, 'cobalagi6', 'sdasdas', NULL, NULL, '2026-03-28 15:11:36', 'staff'),
(19, 'cobalagi7', 'dfsdfds', NULL, NULL, '2026-03-28 15:12:10', 'staff');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `homepage_aims`
--
ALTER TABLE `homepage_aims`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_homepage_aims_order` (`order_number`,`id`),
  ADD KEY `idx_homepage_aims_active` (`is_active`);

--
-- Indeks untuk tabel `homepage_hero`
--
ALTER TABLE `homepage_hero`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `homepage_profile`
--
ALTER TABLE `homepage_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `homepage_vision_mission`
--
ALTER TABLE `homepage_vision_mission`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_projects_order` (`order_number`),
  ADD KEY `idx_projects_active` (`is_active`),
  ADD KEY `idx_projects_featured` (`is_featured`);

--
-- Indeks untuk tabel `project_blocks`
--
ALTER TABLE `project_blocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_project_blocks_project_id` (`project_id`),
  ADD KEY `idx_project_blocks_order` (`order_number`);

--
-- Indeks untuk tabel `project_page_settings`
--
ALTER TABLE `project_page_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `publications`
--
ALTER TABLE `publications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_publications_year` (`year`),
  ADD KEY `idx_publications_created_at` (`created_at`);

--
-- Indeks untuk tabel `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `homepage_aims`
--
ALTER TABLE `homepage_aims`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `homepage_hero`
--
ALTER TABLE `homepage_hero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT untuk tabel `project_blocks`
--
ALTER TABLE `project_blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `project_page_settings`
--
ALTER TABLE `project_page_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `publications`
--
ALTER TABLE `publications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `project_blocks`
--
ALTER TABLE `project_blocks`
  ADD CONSTRAINT `fk_project_blocks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
