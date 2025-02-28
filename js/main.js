// ! Ay Dizisi
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];


// ! Html'den Javascript'e çekilen elemanlar

const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("#close-btn");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
let popupTitle=document.querySelector("header p");
let submitBtn=document.querySelector("#submit-btn");




// !localStroge'den note verilerini al.Eğer localstorga'da note yoksa bunun başlangıç değerini boş dizi olarak belirle.

//!Güncelleme  işlemi için gereken değişkenler

let isUpdate = false;
let updateId = null;

let notes = JSON.parse(localStorage.getItem("notes")) || [];

//Sayfanın yüklenme anını izle

document.addEventListener("DOMContentLoaded", () => {

    //Sayfa yüklendiğinde notları render eden fonksiyonu çalıştır.
    renderNotes(notes);
})

// * AddBox elemanına tıklanınca popup'ı aç

addBox.addEventListener("click", () => {
    //popupBoxContainer && popupBox ı görünür kılmak için claas ekle
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    //Body'nin kaydırılmasını engelle

    document.querySelector("body").style.overflow = "hidden";
});

// * closeBtn'e tıklanınca popup'ı kapat
closeBtn.addEventListener("click", () => {
    //popupBoxContainer && popupBox ı ekrandan gizlemek için show clasını kaldır.
    popupBox.classList.remove("show");
    popupBoxContainer.classList.remove("show");

    //Body'nin kaydırılmasını auto'ya çevir

    document.querySelector("body").style.overflow = "auto";

     //Eğer update işlemi yapılmaz  ve popup kapatılırsa popup' eski haline
     isUpdate=false;
     updateId=null;
     popupTitle.textContent="New Note";
     submitBtn.textContent="Add Note";

     //Formu resetle
     form.reset();
});


// * formun gönderilmesini izle

form.addEventListener("submit", (e) => {
    //form'un sayfa yenilemesini engelle
    e.preventDefault();

    //Form içerisindeki input ve textarea'ya eriş
    const titleınput = e.target[0];
    const descriptionInupt = e.target[1];

    //input ve textarea'nın değerlerine eriş ve başında ve sonunda boşluk varsa bunu kaldır

    let title = titleınput.value.trim();
    let description = descriptionInupt.value.trim();

    //Eğer inputlar boş bırakılırsa uyarı ver

    if (!title && !description) {
        alert("Lütfen formdaki gerekli kısımları doldurunuz.")

        return; //Burada return kullanımı ile if bloğu çalıştıktan sonra kodun devam etmesini engelledik.
    }

    //Tarih verisini oluştur
    const date = new Date();

    //Gün , ay, yıl ve id değerleri oluştur.

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const id = date.getTime();

    if (isUpdate) { 
        //Güncelleme yapılmak istenen notu notes dizisi içerisinde bull
       const findIndex = notes.findIndex((note) => note.id == updateId);

       //Index'i bilinen elemanı dizi elemanını güncelle

       notes[findIndex]={
        title,
        description,
        id,
        date:`${month} ${day}, ${year}`
       }

       //Güncelleme modunu kapat ve popup içeresindeki elemanları eskiye çevir
       isUpdate=false;
       updateId=null;
       popupTitle.textContent="New Note";
       submitBtn.textContent="Add Note";
    }
    else {
        //Note verisini yönetmek için bir obje oluştur.

        let noteInfo = {
            id,
            title,
            description,
            date: `${month} ${day}, ${year}`
        }

        // noteInfo'yu note dizisine ekle
        notes.push(noteInfo);
    }



    //LocalStorage'a not dizisini ekle
    localStorage.setItem("notes", JSON.stringify(notes));

    //Input ve textarea elemanlarının içeriğini temizle

    //Formu resetle
    form.reset();

    //Popup'ı kapat
    popupBox.classList.remove("show");
    popupBoxContainer.classList.remove("show");


    //Body'nin kaydırılmasını auto'ya çevir

    document.querySelector("body").style.overflow = "auto";

    //Notları render et
    renderNotes(notes);
});

//Notları arayüze render edecek fonksiyon

function renderNotes(notes) {

    // !Mevcut notları kaldır
    document.querySelectorAll(".note").forEach((li) => li.remove());

    //Note dizisindeki herbir eleman dön
    notes.forEach((note) => {
        //Not dizisindeki herbir eleman için birer note kartı oluştur

        //Note elemanın ayırt edebilmemiz için bu elemana bir id ata.Bir elemana atamak için bunu data özelliği olarak atarız.
        let noteEleman = `  <li class="note" data-id="${note.id}>
            <!-- Note Details -->
             <div class="details">
                <!-- Title && Description  -->
                 <p class="title">${note.title}</p>
                 <p class="description">${note.description}</p>
             </div>

             <!-- Bottom -->
            <div class="bottom">
                <span>${note.date}</span>
                <div class="settings">
                    <!-- İcon -->
                    <i class='bx bx-dots-horizontal-rounded'></i>
                    <!-- Menu -->
                     <ul class="menu">
                        <li class='editIcon'>
                            <i class='bx bxs-edit'></i>Düzenle
                        </li>
                        <li class='deleteIcon'><i class='bx bx-trash-alt'></i>Sil</li>
                     </ul>
                </div>
            </div>
         </li>`


        addBox.insertAdjacentHTML("afterend", noteEleman)
    });

}

//Menu kısmının görünürlüğünü ayarlayan fonksiyon
function showMenu(eleman) {
    //Dışarıdan gelen elemanın kapsayıcısına show clası ekle
    eleman.parentElement.classList.add("show");
    //Eklenen show classını üç nokta haricinde bir yere tıklanırsa kaldır.
    document.addEventListener("click", (e) => {
        //Tıklanılan eleman üç nokta (i etiketi) değilse ya da kapsam dışarısına tıklandıysa
        if (e.target.tagName != "I" || e.target != eleman) {
            //Kapsam dışırısanı tıklandıysa show classını kaldır.
            eleman.parentElement.classList.remove("show")
        }
    });
}



// *Wrapper kısmındaki tıklanmaları izle

wrapper.addEventListener("click", (e) => {
    //Eğer üç noktaya tıklandıysa 
    if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
        //Show Menu fonksiyonunu çalıştır
        showMenu(e.target);
    }
    //Eğer sil butonuna tıklandıysa
    else if (e.target.classList.contains("deleteIcon")) {
        //Kullanıcıdan silme işlemi için onay al 
        const res = confirm("Bu notu silmek istediğinize eminmisiniz ?");
        //Eğer kullanıcı silme işlemini kabul ettiyse
        if (res) {

            //Tıklanılan elemanın kapsayıcısı olan note kartına eriş
            const note = e.target.closest(".note");

            //Erişilen note kartının id'sine eriş
            const noteId = parseInt(note.dataset.id);

            //Id'si bilinen note'u notu dizisinden kaldır
            notes = notes.filter((note) => note.id != noteId);

            //Localstroage'ı güncelle
            localStorage.setItem("notes", JSON.stringify(notes));

            //Notları render et
            renderNotes(notes);
        }
    }

    //Eğer düzenle butonuna tıklandıysa
    else if (e.target.classList.contains("editIcon")) {
        //Tıklanılan editIcon butonun kapsayıcısı olan note elemanına eriş

        const note = e.target.closest(".note");

        //Erişilen notun id'sine eriş
        const noteId = parseInt(note.dataset.id);

        //Erişilen notu notes dizisi içerisinde bul

        const foundedNote = notes.find((note) => note.id == noteId);

        //Popup'ı güncelleme moduna sok
        isUpdate = true;
        updateId = noteId;

        //Popup'ı görünür kıl
        popupBoxContainer.classList.add("show");
        popupBox.classList.add("show");

        //Popup içerisindeki input ve textareya notun title ve description değerlerini ata 

        form[0].value= foundedNote.title;
        form[1].value= foundedNote.description;

        //Popup içerisindeki title ve add button'un içeriğini update moduna göre düzenle 

        popupTitle.textContent= "Update Note";
        submitBtn.textContent= "Update";
    }
});
