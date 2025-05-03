export async function getPhieuDangKy(maPhieu = "") {
    let url = new URL("/api/getPhieuDangKy", window.location.origin);
    if (maPhieu) url.searchParams.append("maPhieu", maPhieu);
    const res = await fetch(url);
    return await res.json();
}

export async function getPhieuById(maPhieu) {
    const res = await fetch(`/api/getPhieuDangKyById?maPhieu=${maPhieu}`);
    return await res.json();
}
