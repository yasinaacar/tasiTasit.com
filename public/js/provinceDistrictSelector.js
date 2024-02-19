//to get district associated with province when the province is selected

document.addEventListener('DOMContentLoaded', function () {
    const startProvince = document.getElementById('startPoint');
    const startDistrict = document.getElementById('startDistrict');
    const endProvince = document.getElementById('endPoint');
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

    endProvince.addEventListener('change', function () {
        const selectedFinishProvinceId = endProvince.value;
        getDistricts(selectedFinishProvinceId, endDistrict);
    });
});
