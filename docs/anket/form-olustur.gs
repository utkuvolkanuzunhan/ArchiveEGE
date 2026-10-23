/**
 * ArchiveEGE ihtiyaç anketini Google Formlar'da otomatik oluşturur.
 *
 * Kullanım:
 *   1. https://script.google.com adresinde "Yeni proje" açın.
 *   2. Bu dosyanın tamamını yapıştırın ve kaydedin.
 *   3. Üstteki menüden "anketiOlustur" fonksiyonunu seçip "Çalıştır"a basın.
 *   4. İzin isteğini onaylayın.
 *   5. "Yürütme günlüğü"nde (Execution log) iki formun düzenleme ve paylaşım
 *      bağlantıları yazar. Sınıf grubuna sadece "Paylaşım" bağlantılarını atın.
 *
 * İki ayrı form oluşturulur:
 *   - Ana anket: Tamamen anonim. E-posta veya isim toplanmaz.
 *   - Gönüllü formu: Pilot ekibe katılmak isteyenlerin iletişim bilgisi.
 *     Ana anketle bağlantısı yoktur; böylece ana anket anonim kalır.
 */

function anketiOlustur() {
  const gonullu = gonulluFormunuOlustur_();
  const anket = anaAnketiOlustur_(gonullu.getPublishedUrl());

  Logger.log('ANA ANKET');
  Logger.log('  Paylaşım : ' + anket.getPublishedUrl());
  Logger.log('  Düzenleme: ' + anket.getEditUrl());
  Logger.log('GÖNÜLLÜ FORMU');
  Logger.log('  Paylaşım : ' + gonullu.getPublishedUrl());
  Logger.log('  Düzenleme: ' + gonullu.getEditUrl());
}

function anaAnketiOlustur_(gonulluUrl) {
  const form = FormApp.create('EEE Ders Kaynakları Anketi');
  form.setDescription(
    'Ege Üniversitesi Elektrik-Elektronik Mühendisliği öğrencileri için kısa bir anket (yaklaşık 5 dakika).\n\n' +
    'Amaç: Çıkmış sınavlara ve ders notlarına ulaşırken yaşadığımız sorunları anlamak ve ' +
    'herkesin katkı vererek yararlanabileceği ortak bir arşiv sistemi tasarlamak.\n\n' +
    'Anket tamamen anonimdir. İsim veya e-posta toplanmaz. ' +
    'Lütfen açık uçlu sorularda kişi veya hoca ismi vermeyin.'
  );
  sabitAyarlar_(form);

  // --- Bölüm 1: Profil ---
  form.addMultipleChoiceItem()
    .setTitle('Kaçıncı sınıftasınız?')
    .setChoiceValues(['Hazırlık', '1. sınıf', '2. sınıf', '3. sınıf', '4. sınıf', '4. sınıfın üzeri'])
    .setRequired(true);

  // --- Bölüm 2: Mevcut durum ---
  form.addPageBreakItem().setTitle('Bugünkü durum');

  form.addScaleItem()
    .setTitle('Bir derse çalışırken çıkmış sınav veya ders notu bulmakta ne kadar zorlanıyorsunuz?')
    .setBounds(1, 5)
    .setLabels('Hiç zorlanmıyorum', 'Çok zorlanıyorum')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Çıkmış sınavlara ve notlara genellikle nereden ulaşıyorsunuz?')
    .setHelpText('Birden fazla seçebilirsiniz.')
    .setChoiceValues([
      'Üst sınıflardan tanıdıklarım',
      'Kendi sınıfımdaki arkadaşlarım',
      'WhatsApp / Telegram grupları',
      'Fotokopici',
      'Hocanın paylaştıkları',
      'İnternet (başka üniversitelerin kaynakları vb.)',
      'Genellikle ulaşamıyorum'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Son bir yılda, başkalarının ulaşabildiği bir kaynağa ulaşamadığınız için dezavantajlı hissettiğiniz oldu mu?')
    .setChoiceValues(['Hiç olmadı', '1-2 kez', 'Birkaç kez', 'Sık sık'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Bu konuda yaşadığınız bir durumu kısaca anlatır mısınız?')
    .setHelpText('İsteğe bağlı. Lütfen kişi veya hoca ismi vermeyin.');

  form.addCheckboxItem()
    .setTitle('Elinizdeki notları veya çıkmış soruları paylaşmaktan sizi alıkoyan ne olur?')
    .setHelpText('Birden fazla seçebilirsiniz.')
    .setChoiceValues([
      'Bağıl not sistemi: Başkası iyi yaparsa benim notum düşebilir',
      'Emeğimin karşılıksız kalması',
      'Karşılığında bir şey alamamak',
      'Daha önce kimse benimle paylaşmadı',
      'Notlarımın yeterince iyi olmadığını düşünmek',
      'Hocanın veya bölümün tepkisinden çekinmek',
      'Paylaşmaktan çekinmiyorum, zaten paylaşıyorum'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addScaleItem()
    .setTitle('Bağıl değerlendirme, kaynak paylaşma kararınızı ne kadar etkiliyor?')
    .setBounds(1, 5)
    .setLabels('Hiç etkilemiyor', 'Çok etkiliyor')
    .setRequired(true);

  // --- Bölüm 3: Önerilen sistem ---
  form.addPageBreakItem()
    .setTitle('Önerilen sistem')
    .setHelpText(
      'Fikir: Bölüme özel bir arşiv. Not veya çıkmış sınav yükleyen kişi kredi kazanır, ' +
      'kredisiyle başkalarının yüklediği içeriği indirir. Yeni içerik önce katkı verenlere açılır, ' +
      'birkaç yıl içinde herkese ücretsiz hale gelir. Yeni gelenler başlangıç kredisiyle başlar. ' +
      'Kayıt okul e-postasıyla yapılır; dosyalar kişiye özel işaretlenir, böylece toplu sızdırma tespit edilebilir.'
    );

  form.addMultipleChoiceItem()
    .setTitle('Böyle bir sisteme katkı verir misiniz (not veya çıkmış sınav yükler misiniz)?')
    .setChoiceValues(['Kesinlikle evet', 'Muhtemelen evet', 'Kararsızım', 'Muhtemelen hayır', 'Kesinlikle hayır'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Arşivde en çok hangi içeriğe ihtiyaç duyarsınız?')
    .setHelpText('Birden fazla seçebilirsiniz.')
    .setChoiceValues([
      'Çıkmış vize / final soruları',
      'Çıkmış soruların çözümleri',
      'Ders notları',
      'Özetler ve formül kâğıtları',
      'Laboratuvar föyleri ve deney notları',
      'Hangi kaynaktan çalışılacağına dair öneriler'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Bu sistemin hangi kuralı sizi rahatsız eder veya katılmanızı engeller?')
    .setHelpText('İsteğe bağlı.');

  form.addParagraphTextItem()
    .setTitle('Bu sistemi kandırmak isteseydiniz nasıl yapardınız?')
    .setHelpText('İsteğe bağlı. Açıkları şimdiden bulmak için soruyoruz; en yaratıcı fikirler en değerlisi.');

  form.addParagraphTextItem()
    .setTitle('Eklemek istediğiniz başka bir şey var mı?')
    .setHelpText('İsteğe bağlı.');

  // --- Bölüm 4: Platform ---
  form.addPageBreakItem().setTitle('Platform');

  form.addMultipleChoiceItem()
    .setTitle('Telegram kullanımınız hangisine uyuyor?')
    .setHelpText('Sistemin ilk sürümünü bir Telegram botu olarak kurmayı düşünüyoruz.')
    .setChoiceValues([
      'Aktif kullanıyorum',
      'Yüklü ama nadiren kullanıyorum',
      'Yüklü değil ama bu sistem için yüklerim',
      'Yüklü değil ve yüklemem'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Böyle bir sistemi en rahat nereden kullanırsınız?')
    .setChoiceValues(['Telegram botu', 'Web sitesi', 'Mobil uygulama', 'Fark etmez'])
    .setRequired(true);

  form.setConfirmationMessage(
    'Teşekkürler! Pilot ekibe katılmak, moderatör olmak veya gelişmelerden haberdar olmak isterseniz ' +
    'ayrı ve kısa gönüllü formunu doldurabilirsiniz (bu ankete bağlı değildir, anonimliğiniz korunur):\n' + gonulluUrl
  );
  return form;
}

function gonulluFormunuOlustur_() {
  const form = FormApp.create('EEE Ders Kaynakları Arşivi — Gönüllü Formu');
  form.setDescription(
    'Ortak arşiv projesinde yer almak isteyenler için. Bu form ana ankete bağlı değildir.\n\n' +
    'Bilgileriniz yalnızca bu proje kapsamında sizinle iletişim kurmak için kullanılır, ' +
    'üçüncü kişilerle paylaşılmaz ve proje sona erdiğinde silinir. ' +
    'Bilgilerinizin silinmesini istediğiniz zaman talep edebilirsiniz.'
  );
  sabitAyarlar_(form);

  form.addCheckboxItem()
    .setTitle('Nasıl yer almak istersiniz?')
    .setChoiceValues([
      'Pilot aşamasında sistemi deneyen ilk kullanıcılardan olmak',
      'Moderatör olmak (yüklemeleri onaylamak, raporlara bakmak)',
      'Yazılım geliştirmeye katkı vermek',
      'Sadece gelişmelerden haberdar olmak'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Size nasıl ulaşalım?')
    .setHelpText('Telegram kullanıcı adınız veya e-posta adresiniz.')
    .setRequired(true);

  form.setConfirmationMessage('Teşekkürler! En kısa sürede sizinle iletişime geçeceğiz.');
  return form;
}

function sabitAyarlar_(form) {
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(true);
  // Yeni oluşturulan formlar bazı hesaplarda varsayılan olarak yayınlanmamış gelir.
  if (typeof form.setPublished === 'function') {
    form.setPublished(true);
  }
}
