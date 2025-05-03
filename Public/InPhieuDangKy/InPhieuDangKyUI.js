import * as BUS from './bus/InPhieuDangKyBUS.js';

document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("search-box");
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", () => {
        BUS.fetchData(searchBox.value.trim());
    });

    searchBox.addEventListener("keypress", event => {
        if (event.key === "Enter") searchBtn.click();
    });

    const maPhieuDangKy = sessionStorage.getItem("maPhieuDangKy");
    if (maPhieuDangKy) {
        BUS.fetchData(maPhieuDangKy);
        sessionStorage.removeItem("maPhieuDangKy");
    } else {
        BUS.fetchData();
    }
});
