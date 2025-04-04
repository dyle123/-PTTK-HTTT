// Xử lý hiệu ứng fade-in khi trang tải xong
document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add("fade-in");
});

// Xử lý hiệu ứng fade-out khi chuyển trang
document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function(event) {
        const href = this.getAttribute("href");
        if (href && href !== "#") {
            event.preventDefault();
            document.body.classList.remove("fade-in");
            document.body.classList.add("fade-out");
            
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }
    });
});