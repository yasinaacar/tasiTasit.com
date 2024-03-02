const image=document.getElementById("image");
let previewImg=document.getElementById("previewImg");
let removeImgBtn=document.getElementById("removeImgBtn");

image.addEventListener("change",()=>{
    if (image.value) {
        removeImgBtn.disabled = false;
        const file = image.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            previewImg.src = e.target.result;
        }

        reader.readAsDataURL(file);
    }

    previewImg.src=`/static/images/${image.value}`;
});

removeImgBtn.addEventListener("click",()=>{
    if(image.value){
        image.value = "";
        previewImg.src = "";
        removeImgBtn.disabled = true;

    };
});
