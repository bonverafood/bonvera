-- Seed Bonvera products from legacy catalog (Strasbourg SEO)
-- Run after migrate-products-fr.sql

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'cacik', 'published',
  'Cacık', 'Yoğurt ve rendelenmiş salatalıkla hazırlanan, sarımsak ve nane eklenerek lezzetlendirilmiş serinletici bir meze. Yaz aylarında mükemmel bir başlangıç.', 'Yoğurt ve rendelenmiş salatalıkla hazırlanan, sarımsak ve nane eklenerek lezzetlendirilmiş serinletici bir meze. Yaz aylarında mükemmel bir başlangıç.',
  'Cacık', 'Un mezzé rafraîchissant préparé avec du yaourt et du concombre râpé, parfumé à l''ail et à la menthe. Entrée parfaite pour les mois d''été.', 'Un mezzé rafraîchissant préparé avec du yaourt et du concombre râpé, parfumé à l''ail et à la menthe. Entrée parfaite pour les mois d''été.',
  '/products/cacik.jpg',
  'Cacık | Strasbourg Türk Meze — Bonvera', 'Yoğurt ve rendelenmiş salatalıkla hazırlanan, sarımsak ve nane eklenerek lezzetlendirilmiş serinletici bir meze. Yaz aylarında mükemmel bir başlangıç. Strasbourg''da (Fransa) günlük taze üretim.',
  'Cacık | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé rafraîchissant préparé avec du yaourt et du concombre râpé, parfumé à l''ail et à la menthe. Entrée parfaite pour les mois d''été. Production quotidienne à Strasbourg (France).',
  '/products/cacik.jpg', 10, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'ezme', 'published',
  'Ezme', 'Domates, biber, soğan ve baharatlarla hazırlanan, acı sevenler için mükemmel bir meze. Zeytinyağı ile harmanlanmış geleneksel lezzet.', 'Domates, biber, soğan ve baharatlarla hazırlanan, acı sevenler için mükemmel bir meze. Zeytinyağı ile harmanlanmış geleneksel lezzet.',
  'Ezme', 'Un mezzé parfait pour les amateurs d''épices, préparé avec des tomates, des poivrons, des oignons et des épices. Saveur traditionnelle mélangée à l''huile d''olive.', 'Un mezzé parfait pour les amateurs d''épices, préparé avec des tomates, des poivrons, des oignons et des épices. Saveur traditionnelle mélangée à l''huile d''olive.',
  '/products/ezme.png',
  'Ezme | Strasbourg Türk Meze — Bonvera', 'Domates, biber, soğan ve baharatlarla hazırlanan, acı sevenler için mükemmel bir meze. Zeytinyağı ile harmanlanmış geleneksel lezzet. Strasbourg''da (Fransa) günlük taze üretim.',
  'Ezme | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé parfait pour les amateurs d''épices, préparé avec des tomates, des poivrons, des oignons et des épices. Saveur traditionnelle mélangée à l''huile d''olive. Production quotidienne à Strasbourg (France).',
  '/products/ezme.png', 20, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'acili-humus', 'published',
  'Acılı Humus', 'Nohut, tahin, limon suyu ve zeytinyağı ile hazırlanan, Orta Doğu mutfağının sevilen mezelerinden. Acılı versiyonu ile damaklarda iz bırakan lezzet.', 'Nohut, tahin, limon suyu ve zeytinyağı ile hazırlanan, Orta Doğu mutfağının sevilen mezelerinden. Acılı versiyonu ile damaklarda iz bırakan lezzet.',
  'Hummus Épicé', 'L''un des mezzés préférés de la cuisine moyen-orientale, préparé avec des pois chiches, du tahini, du jus de citron et de l''huile d''olive. Une saveur qui marque le palais avec sa version épicée.', 'L''un des mezzés préférés de la cuisine moyen-orientale, préparé avec des pois chiches, du tahini, du jus de citron et de l''huile d''olive. Une saveur qui marque le palais avec sa version épicée.',
  '/products/acili-humus.jpg',
  'Acılı Humus | Strasbourg Türk Meze — Bonvera', 'Nohut, tahin, limon suyu ve zeytinyağı ile hazırlanan, Orta Doğu mutfağının sevilen mezelerinden. Acılı versiyonu ile damaklarda iz bırakan lezzet. Strasbourg''da (Fransa) günlük taze üretim.',
  'Hummus Épicé | Mezzés turcs à Strasbourg — Bonvera', 'L''un des mezzés préférés de la cuisine moyen-orientale, préparé avec des pois chiches, du tahini, du jus de citron et de l''huile d''olive. Une saveur qui marque le palais avec sa version épicée. Production quotidienne à Strasbourg (France).',
  '/products/acili-humus.jpg', 30, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'amerikan-salatasi', 'published',
  'Amerikan Salatası', 'Patates, havuç, bezelye ve mayonez ile hazırlanan, çocukların da sevdiği klasik salata. Renkli ve besleyici bir başlangıç.', 'Patates, havuç, bezelye ve mayonez ile hazırlanan, çocukların da sevdiği klasik salata. Renkli ve besleyici bir başlangıç.',
  'Salade Américaine', 'Une salade classique préparée avec des pommes de terre, des carottes, des pois et de la mayonnaise, également appréciée des enfants. Une entrée colorée et nutritive.', 'Une salade classique préparée avec des pommes de terre, des carottes, des pois et de la mayonnaise, également appréciée des enfants. Une entrée colorée et nutritive.',
  '/products/amerikan-salatasi.jpg',
  'Amerikan Salatası | Strasbourg Türk Meze — Bonvera', 'Patates, havuç, bezelye ve mayonez ile hazırlanan, çocukların da sevdiği klasik salata. Renkli ve besleyici bir başlangıç. Strasbourg''da (Fransa) günlük taze üretim.',
  'Salade Américaine | Mezzés turcs à Strasbourg — Bonvera', 'Une salade classique préparée avec des pommes de terre, des carottes, des pois et de la mayonnaise, également appréciée des enfants. Une entrée colorée et nutritive. Production quotidienne à Strasbourg (France).',
  '/products/amerikan-salatasi.jpg', 40, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'barbunya-salatasi', 'published',
  'Barbunya Salatası', 'Barbunya fasulyesi, soğan, maydanoz ve zeytinyağı ile hazırlanan protein bakımından zengin, doyurucu bir meze. Sağlıklı ve lezzetli.', 'Barbunya fasulyesi, soğan, maydanoz ve zeytinyağı ile hazırlanan protein bakımından zengin, doyurucu bir meze. Sağlıklı ve lezzetli.',
  'Salade de Haricots Borlotti', 'Un mezzé riche en protéines et satisfaisant, préparé avec des haricots borlotti, des oignons, du persil et de l''huile d''olive. Sain et délicieux.', 'Un mezzé riche en protéines et satisfaisant, préparé avec des haricots borlotti, des oignons, du persil et de l''huile d''olive. Sain et délicieux.',
  '/products/barbunya-salatasi.jpg',
  'Barbunya Salatası | Strasbourg Türk Meze — Bonvera', 'Barbunya fasulyesi, soğan, maydanoz ve zeytinyağı ile hazırlanan protein bakımından zengin, doyurucu bir meze. Sağlıklı ve lezzetli. Strasbourg''da (Fransa) günlük taze üretim.',
  'Salade de Haricots Borlotti | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé riche en protéines et satisfaisant, préparé avec des haricots borlotti, des oignons, du persil et de l''huile d''olive. Sain et délicieux. Production quotidienne à Strasbourg (France).',
  '/products/barbunya-salatasi.jpg', 50, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'domates-kurusu', 'published',
  'Domates Kurusu', 'Kurutulmuş domates, zeytinyağı ve taze otlarla hazırlanan, yoğun lezzetli ve aromatik bir meze. Akdeniz mutfağının vazgeçilmezi.', 'Kurutulmuş domates, zeytinyağı ve taze otlarla hazırlanan, yoğun lezzetli ve aromatik bir meze. Akdeniz mutfağının vazgeçilmezi.',
  'Tomates Séchées', 'Un mezzé intense et aromatique préparé avec des tomates séchées, de l''huile d''olive et des herbes fraîches. Un incontournable de la cuisine méditerranéenne.', 'Un mezzé intense et aromatique préparé avec des tomates séchées, de l''huile d''olive et des herbes fraîches. Un incontournable de la cuisine méditerranéenne.',
  '/products/domates-kurusu.jpg',
  'Domates Kurusu | Strasbourg Türk Meze — Bonvera', 'Kurutulmuş domates, zeytinyağı ve taze otlarla hazırlanan, yoğun lezzetli ve aromatik bir meze. Akdeniz mutfağının vazgeçilmezi. Strasbourg''da (Fransa) günlük taze üretim.',
  'Tomates Séchées | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé intense et aromatique préparé avec des tomates séchées, de l''huile d''olive et des herbes fraîches. Un incontournable de la cuisine méditerranéenne. Production quotidienne à Strasbourg (France).',
  '/products/domates-kurusu.jpg', 60, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'fava', 'published',
  'Fava', 'Ege ve Yunan mutfağıyla özdeşleşen, kuru bakla ile hazırlanan protein bakımından zengin bir meze. Zeytinyağı, limon ve taze otlarla lezzetlendirilmiş.', 'Ege ve Yunan mutfağıyla özdeşleşen, kuru bakla ile hazırlanan protein bakımından zengin bir meze. Zeytinyağı, limon ve taze otlarla lezzetlendirilmiş.',
  'Fava', 'Un mezzé riche en protéines identifié à la cuisine égéenne et grecque, préparé avec des fèves séchées. Parfumé à l''huile d''olive, au citron et aux herbes fraîches.', 'Un mezzé riche en protéines identifié à la cuisine égéenne et grecque, préparé avec des fèves séchées. Parfumé à l''huile d''olive, au citron et aux herbes fraîches.',
  '/products/fava.jpg',
  'Fava | Strasbourg Türk Meze — Bonvera', 'Ege ve Yunan mutfağıyla özdeşleşen, kuru bakla ile hazırlanan protein bakımından zengin bir meze. Zeytinyağı, limon ve taze otlarla lezzetlendirilmiş. Strasbourg''da (Fransa) günlük taze üretim.',
  'Fava | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé riche en protéines identifié à la cuisine égéenne et grecque, préparé avec des fèves séchées. Parfumé à l''huile d''olive, au citron et aux herbes fraîches. Production quotidienne à Strasbourg (France).',
  '/products/fava.jpg', 70, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'grek-salatasi', 'published',
  'Grek Salatası', 'Domates, salatalık, zeytin, soğan ve beyaz peynir ile hazırlanan, Akdeniz mutfağının en sevilen salatalarından. Taze ve sağlıklı.', 'Domates, salatalık, zeytin, soğan ve beyaz peynir ile hazırlanan, Akdeniz mutfağının en sevilen salatalarından. Taze ve sağlıklı.',
  'Salade Grecque', 'L''une des salades les plus appréciées de la cuisine méditerranéenne, préparée avec des tomates, des concombres, des olives, des oignons et du fromage blanc. Fraîche et saine.', 'L''une des salades les plus appréciées de la cuisine méditerranéenne, préparée avec des tomates, des concombres, des olives, des oignons et du fromage blanc. Fraîche et saine.',
  '/products/grek-salatasi.jpg',
  'Grek Salatası | Strasbourg Türk Meze — Bonvera', 'Domates, salatalık, zeytin, soğan ve beyaz peynir ile hazırlanan, Akdeniz mutfağının en sevilen salatalarından. Taze ve sağlıklı. Strasbourg''da (Fransa) günlük taze üretim.',
  'Salade Grecque | Mezzés turcs à Strasbourg — Bonvera', 'L''une des salades les plus appréciées de la cuisine méditerranéenne, préparée avec des tomates, des concombres, des olives, des oignons et du fromage blanc. Fraîche et saine. Production quotidienne à Strasbourg (France).',
  '/products/grek-salatasi.jpg', 80, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'mantar-salatasi', 'published',
  'Mantar Salatası', 'Taze mantar, soğan, maydanoz ve zeytinyağı ile hazırlanan, doğal ve aromatik bir meze. Mantar severlerin favorisi.', 'Taze mantar, soğan, maydanoz ve zeytinyağı ile hazırlanan, doğal ve aromatik bir meze. Mantar severlerin favorisi.',
  'Salade de Champignons', 'Un mezzé naturel et aromatique préparé avec des champignons frais, des oignons, du persil et de l''huile d''olive. Favori des amateurs de champignons.', 'Un mezzé naturel et aromatique préparé avec des champignons frais, des oignons, du persil et de l''huile d''olive. Favori des amateurs de champignons.',
  '/products/mantar-salatasi.jpg',
  'Mantar Salatası | Strasbourg Türk Meze — Bonvera', 'Taze mantar, soğan, maydanoz ve zeytinyağı ile hazırlanan, doğal ve aromatik bir meze. Mantar severlerin favorisi. Strasbourg''da (Fransa) günlük taze üretim.',
  'Salade de Champignons | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé naturel et aromatique préparé avec des champignons frais, des oignons, du persil et de l''huile d''olive. Favori des amateurs de champignons. Production quotidienne à Strasbourg (France).',
  '/products/mantar-salatasi.jpg', 90, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'mor-lahana', 'published',
  'Mor Lahana', 'Mor lahana, havuç, maydanoz ve limon suyu ile hazırlanan, renkli ve vitamin bakımından zengin bir meze. Sağlıklı ve ferah.', 'Mor lahana, havuç, maydanoz ve limon suyu ile hazırlanan, renkli ve vitamin bakımından zengin bir meze. Sağlıklı ve ferah.',
  'Chou Rouge', 'Un mezzé coloré et riche en vitamines, préparé avec du chou rouge, des carottes, du persil et du jus de citron. Sain et rafraîchissant.', 'Un mezzé coloré et riche en vitamines, préparé avec du chou rouge, des carottes, du persil et du jus de citron. Sain et rafraîchissant.',
  '/products/mor-lahana.jpg',
  'Mor Lahana | Strasbourg Türk Meze — Bonvera', 'Mor lahana, havuç, maydanoz ve limon suyu ile hazırlanan, renkli ve vitamin bakımından zengin bir meze. Sağlıklı ve ferah. Strasbourg''da (Fransa) günlük taze üretim.',
  'Chou Rouge | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé coloré et riche en vitamines, préparé avec du chou rouge, des carottes, du persil et du jus de citron. Sain et rafraîchissant. Production quotidienne à Strasbourg (France).',
  '/products/mor-lahana.jpg', 100, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'muammara', 'published',
  'Muammara', 'Ceviz, kırmızı biber, ekmek ve zeytinyağı ile hazırlanan, Suriye mutfağından gelen aromatik bir meze. Zengin ve doyurucu lezzet.', 'Ceviz, kırmızı biber, ekmek ve zeytinyağı ile hazırlanan, Suriye mutfağından gelen aromatik bir meze. Zengin ve doyurucu lezzet.',
  'Muammara', 'Un mezzé aromatique de la cuisine syrienne, préparé avec des noix, des poivrons rouges, du pain et de l''huile d''olive. Saveur riche et satisfaisante.', 'Un mezzé aromatique de la cuisine syrienne, préparé avec des noix, des poivrons rouges, du pain et de l''huile d''olive. Saveur riche et satisfaisante.',
  '/products/muammara.jpg',
  'Muammara | Strasbourg Türk Meze — Bonvera', 'Ceviz, kırmızı biber, ekmek ve zeytinyağı ile hazırlanan, Suriye mutfağından gelen aromatik bir meze. Zengin ve doyurucu lezzet. Strasbourg''da (Fransa) günlük taze üretim.',
  'Muammara | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé aromatique de la cuisine syrienne, préparé avec des noix, des poivrons rouges, du pain et de l''huile d''olive. Saveur riche et satisfaisante. Production quotidienne à Strasbourg (France).',
  '/products/muammara.jpg', 110, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'muhteber', 'published',
  'Muhteber', 'Patlıcan, domates, soğan ve baharatlarla hazırlanan, Hatay mutfağından gelen geleneksel bir meze. Zengin aromalı ve doyurucu.', 'Patlıcan, domates, soğan ve baharatlarla hazırlanan, Hatay mutfağından gelen geleneksel bir meze. Zengin aromalı ve doyurucu.',
  'Muhteber', 'Un mezzé traditionnel de la cuisine de Hatay, préparé avec des aubergines, des tomates, des oignons et des épices. Aromatique et satisfaisant.', 'Un mezzé traditionnel de la cuisine de Hatay, préparé avec des aubergines, des tomates, des oignons et des épices. Aromatique et satisfaisant.',
  '/products/muhteber.jpg',
  'Muhteber | Strasbourg Türk Meze — Bonvera', 'Patlıcan, domates, soğan ve baharatlarla hazırlanan, Hatay mutfağından gelen geleneksel bir meze. Zengin aromalı ve doyurucu. Strasbourg''da (Fransa) günlük taze üretim.',
  'Muhteber | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé traditionnel de la cuisine de Hatay, préparé avec des aubergines, des tomates, des oignons et des épices. Aromatique et satisfaisant. Production quotidienne à Strasbourg (France).',
  '/products/muhteber.jpg', 120, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'pancar-salatasi', 'published',
  'Pancar Salatası', 'Haşlanmış pancar, ceviz, maydanoz ve zeytinyağı ile hazırlanan, renkli ve besleyici bir meze. Doğal tatlılığı ile öne çıkan lezzet.', 'Haşlanmış pancar, ceviz, maydanoz ve zeytinyağı ile hazırlanan, renkli ve besleyici bir meze. Doğal tatlılığı ile öne çıkan lezzet.',
  'Salade de Betterave', 'Un mezzé coloré et nutritif préparé avec des betteraves bouillies, des noix, du persil et de l''huile d''olive. Une saveur qui se distingue par sa douceur naturelle.', 'Un mezzé coloré et nutritif préparé avec des betteraves bouillies, des noix, du persil et de l''huile d''olive. Une saveur qui se distingue par sa douceur naturelle.',
  '/products/pancar-salatasi.jpg',
  'Pancar Salatası | Strasbourg Türk Meze — Bonvera', 'Haşlanmış pancar, ceviz, maydanoz ve zeytinyağı ile hazırlanan, renkli ve besleyici bir meze. Doğal tatlılığı ile öne çıkan lezzet. Strasbourg''da (Fransa) günlük taze üretim.',
  'Salade de Betterave | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé coloré et nutritif préparé avec des betteraves bouillies, des noix, du persil et de l''huile d''olive. Une saveur qui se distingue par sa douceur naturelle. Production quotidienne à Strasbourg (France).',
  '/products/pancar-salatasi.jpg', 130, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'patlicanli-humus', 'published',
  'Patlıcanlı Humus', 'Klasik humusa köz patlıcan eklenerek hazırlanan, dumanlı aroması ile öne çıkan özel bir meze. Farklı ve lezzetli.', 'Klasik humusa köz patlıcan eklenerek hazırlanan, dumanlı aroması ile öne çıkan özel bir meze. Farklı ve lezzetli.',
  'Hummus aux Aubergines', 'Un mezzé spécial préparé en ajoutant des aubergines grillées au hummus classique, se distinguant par son arôme fumé. Différent et délicieux.', 'Un mezzé spécial préparé en ajoutant des aubergines grillées au hummus classique, se distinguant par son arôme fumé. Différent et délicieux.',
  '/products/patlicanli-humus.jpg',
  'Patlıcanlı Humus | Strasbourg Türk Meze — Bonvera', 'Klasik humusa köz patlıcan eklenerek hazırlanan, dumanlı aroması ile öne çıkan özel bir meze. Farklı ve lezzetli. Strasbourg''da (Fransa) günlük taze üretim.',
  'Hummus aux Aubergines | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé spécial préparé en ajoutant des aubergines grillées au hummus classique, se distinguant par son arôme fumé. Différent et délicieux. Production quotidienne à Strasbourg (France).',
  '/products/patlicanli-humus.jpg', 140, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'saksuka', 'published',
  'Şakşuka', 'Patlıcan, domates, biber, soğan ve yumurta ile hazırlanan, Türk mutfağının sevilen mezelerinden. Renkli ve doyurucu.', 'Patlıcan, domates, biber, soğan ve yumurta ile hazırlanan, Türk mutfağının sevilen mezelerinden. Renkli ve doyurucu.',
  'Şakşuka', 'L''un des mezzés préférés de la cuisine turque, préparé avec des aubergines, des tomates, des poivrons, des oignons et des œufs. Coloré et satisfaisant.', 'L''un des mezzés préférés de la cuisine turque, préparé avec des aubergines, des tomates, des poivrons, des oignons et des œufs. Coloré et satisfaisant.',
  '/products/saksuka.jpg',
  'Şakşuka | Strasbourg Türk Meze — Bonvera', 'Patlıcan, domates, biber, soğan ve yumurta ile hazırlanan, Türk mutfağının sevilen mezelerinden. Renkli ve doyurucu. Strasbourg''da (Fransa) günlük taze üretim.',
  'Şakşuka | Mezzés turcs à Strasbourg — Bonvera', 'L''un des mezzés préférés de la cuisine turque, préparé avec des aubergines, des tomates, des poivrons, des oignons et des œufs. Coloré et satisfaisant. Production quotidienne à Strasbourg (France).',
  '/products/saksuka.jpg', 150, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'tarator', 'published',
  'Tarator', 'Ceviz, ekmek, sarımsak, zeytinyağı ve limon ile hazırlanan, Balkan mutfağından gelen serinletici bir meze. Yoğun aromalı ve besleyici.', 'Ceviz, ekmek, sarımsak, zeytinyağı ve limon ile hazırlanan, Balkan mutfağından gelen serinletici bir meze. Yoğun aromalı ve besleyici.',
  'Tarator', 'Un mezzé rafraîchissant de la cuisine balkanique, préparé avec des noix, du pain, de l''ail, de l''huile d''olive et du citron. Intensément aromatique et nutritif.', 'Un mezzé rafraîchissant de la cuisine balkanique, préparé avec des noix, du pain, de l''ail, de l''huile d''olive et du citron. Intensément aromatique et nutritif.',
  '/products/tarator.jpg',
  'Tarator | Strasbourg Türk Meze — Bonvera', 'Ceviz, ekmek, sarımsak, zeytinyağı ve limon ile hazırlanan, Balkan mutfağından gelen serinletici bir meze. Yoğun aromalı ve besleyici. Strasbourg''da (Fransa) günlük taze üretim.',
  'Tarator | Mezzés turcs à Strasbourg — Bonvera', 'Un mezzé rafraîchissant de la cuisine balkanique, préparé avec des noix, du pain, de l''ail, de l''huile d''olive et du citron. Intensément aromatique et nutritif. Production quotidienne à Strasbourg (France).',
  '/products/tarator.jpg', 160, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'yaprak-sarmasi', 'published',
  'Yaprak Sarma', 'Asma yaprağı, pirinç, soğan ve baharatlarla hazırlanan geleneksel sarma. Türk mutfağının en sevilen lezzetlerinden biri.', 'Asma yaprağı, pirinç, soğan ve baharatlarla hazırlanan geleneksel sarma. Türk mutfağının en sevilen lezzetlerinden biri.',
  'Sarma aux Feuilles de Vigne', 'Sarma traditionnel préparé avec des feuilles de vigne, du riz, des oignons et des épices. L''une des saveurs les plus appréciées de la cuisine turque.', 'Sarma traditionnel préparé avec des feuilles de vigne, du riz, des oignons et des épices. L''une des saveurs les plus appréciées de la cuisine turque.',
  '/products/yaprak-sarmasi.jpg',
  'Yaprak Sarma | Strasbourg Türk Meze — Bonvera', 'Asma yaprağı, pirinç, soğan ve baharatlarla hazırlanan geleneksel sarma. Türk mutfağının en sevilen lezzetlerinden biri. Strasbourg''da (Fransa) günlük taze üretim.',
  'Sarma aux Feuilles de Vigne | Mezzés turcs à Strasbourg — Bonvera', 'Sarma traditionnel préparé avec des feuilles de vigne, du riz, des oignons et des épices. L''une des saveurs les plus appréciées de la cuisine turque. Production quotidienne à Strasbourg (France).',
  '/products/yaprak-sarmasi.jpg', 170, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'kabak-sarmasi', 'published',
  'Kabak Sarma', 'Kabak yaprağı, pirinç, soğan ve baharatlarla hazırlanan lezzetli sarma. Hafif ve sağlıklı, yaz aylarında tercih edilen özel lezzet.', 'Kabak yaprağı, pirinç, soğan ve baharatlarla hazırlanan lezzetli sarma. Hafif ve sağlıklı, yaz aylarında tercih edilen özel lezzet.',
  'Sarma aux Courgettes', 'Délicieux sarma préparé avec des feuilles de courgettes, du riz, des oignons et des épices. Léger et sain, une saveur spéciale préférée pendant les mois d''été.', 'Délicieux sarma préparé avec des feuilles de courgettes, du riz, des oignons et des épices. Léger et sain, une saveur spéciale préférée pendant les mois d''été.',
  '/products/kabak-sarmasi.jpg',
  'Kabak Sarma | Strasbourg Türk Meze — Bonvera', 'Kabak yaprağı, pirinç, soğan ve baharatlarla hazırlanan lezzetli sarma. Hafif ve sağlıklı, yaz aylarında tercih edilen özel lezzet. Strasbourg''da (Fransa) günlük taze üretim.',
  'Sarma aux Courgettes | Mezzés turcs à Strasbourg — Bonvera', 'Délicieux sarma préparé avec des feuilles de courgettes, du riz, des oignons et des épices. Léger et sain, une saveur spéciale préférée pendant les mois d''été. Production quotidienne à Strasbourg (France).',
  '/products/kabak-sarmasi.jpg', 180, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'patlican-sarmasi', 'published',
  'Patlıcan Sarma', 'Patlıcan yaprağı, pirinç, soğan ve baharatlarla hazırlanan özel sarma. Patlıcan severlerin favorisi, aromatik ve lezzetli.', 'Patlıcan yaprağı, pirinç, soğan ve baharatlarla hazırlanan özel sarma. Patlıcan severlerin favorisi, aromatik ve lezzetli.',
  'Sarma aux Aubergines', 'Sarma spécial préparé avec des feuilles d''aubergines, du riz, des oignons et des épices. Favori des amateurs d''aubergines, aromatique et délicieux.', 'Sarma spécial préparé avec des feuilles d''aubergines, du riz, des oignons et des épices. Favori des amateurs d''aubergines, aromatique et délicieux.',
  '/products/patlican-sarmasi.jpg',
  'Patlıcan Sarma | Strasbourg Türk Meze — Bonvera', 'Patlıcan yaprağı, pirinç, soğan ve baharatlarla hazırlanan özel sarma. Patlıcan severlerin favorisi, aromatik ve lezzetli. Strasbourg''da (Fransa) günlük taze üretim.',
  'Sarma aux Aubergines | Mezzés turcs à Strasbourg — Bonvera', 'Sarma spécial préparé avec des feuilles d''aubergines, du riz, des oignons et des épices. Favori des amateurs d''aubergines, aromatique et délicieux. Production quotidienne à Strasbourg (France).',
  '/products/patlican-sarmasi.jpg', 190, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'kizarmis-icli-kofte', 'published',
  'Kızarmış İçli Köfte', 'Geleneksel tarifle hazırlanan, kızartılarak servis edilen içli köfte. Çıtır dış yapısı ve lezzetli iç harcı ile öne çıkan özel lezzet.', 'Geleneksel tarifle hazırlanan, kızartılarak servis edilen içli köfte. Çıtır dış yapısı ve lezzetli iç harcı ile öne çıkan özel lezzet.',
  'İçli Köfte Frit', 'İçli köfte préparé selon une recette traditionnelle, servi frit. Une saveur spéciale qui se distingue par sa structure extérieure croustillante et sa garniture délicieuse.', 'İçli köfte préparé selon une recette traditionnelle, servi frit. Une saveur spéciale qui se distingue par sa structure extérieure croustillante et sa garniture délicieuse.',
  '/products/kizarmis-icli-kofte.jpg',
  'Kızarmış İçli Köfte | Strasbourg Türk Meze — Bonvera', 'Geleneksel tarifle hazırlanan, kızartılarak servis edilen içli köfte. Çıtır dış yapısı ve lezzetli iç harcı ile öne çıkan özel lezzet. Strasbourg''da (Fransa) günlük taze üretim.',
  'İçli Köfte Frit | Mezzés turcs à Strasbourg — Bonvera', 'İçli köfte préparé selon une recette traditionnelle, servi frit. Une saveur spéciale qui se distingue par sa structure extérieure croustillante et sa garniture délicieuse. Production quotidienne à Strasbourg (France).',
  '/products/kizarmis-icli-kofte.jpg', 200, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();

INSERT INTO public.products (
  slug, status, name_tr, summary_tr, body_tr, name_fr, summary_fr, body_fr,
  image_url, seo_title_tr, seo_description_tr, seo_title_fr, seo_description_fr,
  og_image_url, sort_order, published_at, updated_at
) VALUES (
  'cig-icli-kofte', 'published',
  'Çiğ İçli Köfte', 'Çiğ olarak servis edilen, geleneksel tarifle hazırlanan içli köfte. Taze ve doğal malzemelerle yapılan, sağlıklı ve lezzetli seçenek.', 'Çiğ olarak servis edilen, geleneksel tarifle hazırlanan içli köfte. Taze ve doğal malzemelerle yapılan, sağlıklı ve lezzetli seçenek.',
  'İçli Köfte Cru', 'İçli köfte préparé selon une recette traditionnelle, servi cru. Une option saine et délicieuse faite avec des ingrédients frais et naturels.', 'İçli köfte préparé selon une recette traditionnelle, servi cru. Une option saine et délicieuse faite avec des ingrédients frais et naturels.',
  '/products/cig-icli-kofte.jpg',
  'Çiğ İçli Köfte | Strasbourg Türk Meze — Bonvera', 'Çiğ olarak servis edilen, geleneksel tarifle hazırlanan içli köfte. Taze ve doğal malzemelerle yapılan, sağlıklı ve lezzetli seçenek. Strasbourg''da (Fransa) günlük taze üretim.',
  'İçli Köfte Cru | Mezzés turcs à Strasbourg — Bonvera', 'İçli köfte préparé selon une recette traditionnelle, servi cru. Une option saine et délicieuse faite avec des ingrédients frais et naturels. Production quotidienne à Strasbourg (France).',
  '/products/cig-icli-kofte.jpg', 210, now(), now()
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  name_tr = EXCLUDED.name_tr,
  summary_tr = EXCLUDED.summary_tr,
  body_tr = EXCLUDED.body_tr,
  name_fr = EXCLUDED.name_fr,
  summary_fr = EXCLUDED.summary_fr,
  body_fr = EXCLUDED.body_fr,
  image_url = EXCLUDED.image_url,
  seo_title_tr = EXCLUDED.seo_title_tr,
  seo_description_tr = EXCLUDED.seo_description_tr,
  seo_title_fr = EXCLUDED.seo_title_fr,
  seo_description_fr = EXCLUDED.seo_description_fr,
  og_image_url = EXCLUDED.og_image_url,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.products.published_at, now()),
  updated_at = now();
