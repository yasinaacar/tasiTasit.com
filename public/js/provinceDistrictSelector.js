//to get district associated with province when the province is selected

document.addEventListener('DOMContentLoaded', function () {
    const startProvince = document.getElementById('startProvince');
    const startDistrict = document.getElementById('startDistrict');
    const finishProvince = document.getElementById('finishProvince');
    const endDistrict = document.getElementById('endDistrict');

    // function of get district
    const getDistricts = (provinceId, districtElement) => {
    fetch(`https://turkiyeapi.dev/api/v1/provinces/${provinceId}`)
        .then(response => response.json())
        .then(data => {
            districtElement.innerHTML = '<option value="-1" selected>İlçe Seçin</option>';

            for (const district of data.data.districts) {
                const option = document.createElement('option');
                option.value = district.id;
                option.textContent = district.name;
                districtElement.appendChild(option);
            }
        })
        .catch(error => console.error('İlçeler getirilemedi:', error));
    };

    // get district with event listener
    startProvince.addEventListener('change', function () {
        const selectedStartProvinceId = startProvince.value;
        getDistricts(selectedStartProvinceId, startDistrict);
    });

    finishProvince.addEventListener('change', function () {
        const selectedFinishProvinceId = finishProvince.value;
        getDistricts(selectedFinishProvinceId, endDistrict);
    });
});
