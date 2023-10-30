// this file contains all regex patterns for fields need to be mapped

// for title
const titleNameRe =
    "user.?name|user.?id|nickname|maiden name|title|prefix|suffix|adres başlığınız|vollständiger.?name|用户名|(?:사용자.?)?아이디|사용자.?ID";

// for firstname
const firstNameRe = 
	"first.*name|initials|fname|first$|given.*name|vorname|nombre|forename|prénom|prenom|名|nome|Имя|نام|이름|പേര്|(\\b|_|\\*)(isim|ad|ad(i|ı|iniz|ınız)?)(\\b|_|\\*)|नाम|FirstName";

// for lastname
const lastNameRe =
    "last.*name|lname|surname(?!\\d)|last$|secondname|family.*name|nachname|apellidos?|famille|^nom(?!bre)|cognome|姓|apelidos|surename|sobrenome|Фамилия|نام.*خانوادگی|उपनाम|മറുപേര്|(\\b|_|\\*)(soyisim|soyad(i|ı|iniz|ınız)?)(\\b|_|\\*)|\\b성(?:[^명]|\\b)|LastName";

// for fullname
const fullNameRe = 
    "^name|full.?name|your.?name|customer.?name|bill.?name|ship.?name|name.*first.*last|firstandlastname|nombre.*y.*apellidos|^nom(?!bre)|お名前|氏名|^nome|نام.*نام.*خانوادگی|姓名|(\\b|_|\\*)ad[ı]? soyad[ı]?(\\b|_|\\*)|성명";

// for country
const countryRe =
    "country|countries|país|pais|(\\b|_)land(\\b|_)(?!.*(mark.*))|(?<!(入|出))国|国家|국가|나라|(\\b|_)(ülke|ulce|ulke)(\\b|_)|کشور";

// for day
const dobDayRe   = "DD|day";

// for month
const dobMonthRe = "MM|month";

// for year
const dobYearRe  = "YY|year";

// for date of birth
const dobRe  = "date_of_birth|dob|ddmmyy";

export {
	titleNameRe,
	firstNameRe,
	lastNameRe,
	fullNameRe,
	countryRe,
	dobDayRe,
	dobMonthRe,
	dobYearRe,
	dobRe
};