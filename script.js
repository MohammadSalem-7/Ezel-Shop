// تحميل السلة من localStorage أو إنشاء سلة جديدة
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// تحديث عدد المنتجات في السلة
function updateCartUI() {
    let cartCount = document.getElementById("cart-count");
    let cartList = document.getElementById("cart-list");

    if (cartCount) {
        cartCount.innerText = cart.length;
    }

    if (cartList) {
        cartList.innerHTML = ""; // مسح القائمة السابقة
        cart.forEach((item, index) => {
            let li = document.createElement("li");
            li.innerHTML = `${item.name} - ${item.price} ريال 
                <button onclick="removeFromCart(${index})">❌ حذف</button>`;
            cartList.appendChild(li);
        });
    }
}

// إضافة منتج إلى السلة
function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart)); // حفظ السلة
    updateCartUI();
    alert(name + " تمت إضافته للسلة!");
}

// حذف منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1); // حذف المنتج
    localStorage.setItem("cart", JSON.stringify(cart)); // تحديث البيانات
    updateCartUI();
}

// تحديث السلة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", updateCartUI);

// دالة تغيير العملة
function changeCurrency() {
    let selectedCurrency = document.getElementById("currency-selector").value;
    let prices = document.querySelectorAll(".price");
    let currencyLabels = document.querySelectorAll(".currency");

    let exchangeRates = {
        "SAR": 1,        // الريال السعودي
        "USD": 0.27,     // الدولار الأمريكي
        "EUR": 0.25      // اليورو
    };

    prices.forEach((price, index) => {
        let originalPrice = parseInt(price.getAttribute("data-original")); // السعر الأساسي
        let convertedPrice = (originalPrice * exchangeRates[selectedCurrency]).toFixed(2);
        price.textContent = convertedPrice;
        currencyLabels[index].textContent = selectedCurrency;
    });
}

// دالة إضافة المنتج للسلة بالسعر المحدّث
function addToCart(productName) {
    let selectedCurrency = document.getElementById("currency-selector").value;
    let productElement = document.querySelector(`.product h2:contains('${productName}')`).parentNode;
    let priceElement = productElement.querySelector(".price");
    let priceValue = parseFloat(priceElement.textContent);
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name: productName, price: priceValue, currency: selectedCurrency });
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${productName} تمت إضافته إلى السلة بسعر ${priceValue} ${selectedCurrency}!`);
}

// حفظ الأسعار الأصلية عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    let prices = document.querySelectorAll(".price");
    prices.forEach(price => {
        price.setAttribute("data-original", price.textContent); // تخزين السعر الأصلي
    });
});

document.getElementById('toggleForm').addEventListener('click', toggleForm);
document.getElementById('authForm').addEventListener('submit', handleAuth);

let isLogin = true; // افتراضيًا تسجيل الدخول

function toggleForm() {
    isLogin = !isLogin;
    document.getElementById('formTitle').innerText = isLogin ? "تسجيل الدخول" : "إنشاء حساب";
    document.getElementById('profilePicContainer').style.display = isLogin ? "none" : "block";
    document.querySelector("button").innerText = isLogin ? "دخول" : "إنشاء حساب";
    document.getElementById('toggleForm').innerHTML = isLogin 
        ? 'ليس لديك حساب؟ <span>سجل الآن</span>' 
        : 'لديك حساب؟ <span>سجل دخول</span>';
}

function handleAuth(event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert("يرجى إدخال جميع البيانات!");
        return;
    }

    if (isLogin) {
        // تسجيل الدخول
        let userData = JSON.parse(localStorage.getItem("userAccount"));
        if (userData && userData.username === username && userData.password === password) {
            localStorage.setItem("loggedInUser", username);
            alert("تم تسجيل الدخول بنجاح!");
            window.location.href = "index.html";
        } else {
            alert("⚠ اسم المستخدم أو كلمة المرور غير صحيحة!");
        }
    } else {
        // إنشاء حساب جديد
        if (localStorage.getItem("userAccount")) {
            alert("⚠ لا يمكنك إنشاء أكثر من حساب على هذا الجهاز!");
            return;
        }

        let profilePic = document.getElementById('profilePic').files[0];
        let profilePicURL = profilePic ? URL.createObjectURL(profilePic) : "default-profile.png";

        let newUser = { username, password, profilePic: profilePicURL };
        localStorage.setItem("userAccount", JSON.stringify(newUser));
        alert("🎉 تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
        toggleForm(); // العودة لنموذج تسجيل الدخول
    }
}

window.onload = function () {
    let loginBtn = document.getElementById("loginBtn");
    let exploreBtn = document.getElementById("exploreBtn");
    let profile = document.getElementById("profile");
    let usernameDisplay = document.getElementById("usernameDisplay");
    let profileImage = document.getElementById("profileImage");

    let userData = JSON.parse(localStorage.getItem("userAccount"));
    let loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser && userData) {
        loginBtn.style.display = "none"; // إخفاء زر تسجيل الدخول
        exploreBtn.style.display = "inline-block"; // إظهار زر "اكتشف الآن"
        profile.style.display = "flex"; // إظهار البروفايل
        usernameDisplay.innerText = userData.username; // عرض اسم المستخدم

        // ✅ تحميل الصورة إذا كانت موجودة
        if (userData.profilePic && userData.profilePic !== "") {
            profileImage.src = userData.profilePic;
        } else {
            profileImage.src = "default-profile.png"; // صورة افتراضية
        }
    }
};

// 🔄 تسجيل الدخول وحفظ البيانات
function saveUserProfile() {
    let username = document.getElementById("username").value;
    let profilePic = document.getElementById("profilePic").value;

    if (!username) {
        alert("يجب إدخال اسم المستخدم!");
        return;
    }

    if (!profilePic || profilePic.trim() === "") {
        profilePic = "default-profile.png"; // صورة افتراضية إذا لم يتم اختيار واحدة
    }

    let userAccount = {
        username: username,
        profilePic: profilePic
    };

    localStorage.setItem("userAccount", JSON.stringify(userAccount));
    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html"; // إعادة التوجيه للصفحة الرئيسية
}

// الانتقال لصفحة تسجيل الدخول
function redirectToLogin() {
    window.location.href = "login.html";
}

// الانتقال لصفحة المنتجات
function redirectToProducts() {
    window.location.href = "products.html";
}

document.getElementById("profilePic").addEventListener("input", function () {
    let profilePreview = document.getElementById("profilePreview");
    let imgUrl = this.value.trim();

    if (imgUrl) {
        profilePreview.src = imgUrl;
        profilePreview.style.display = "block";
    } else {
        profilePreview.style.display = "none";
    }
});

function saveUserProfile() {
    let username = document.getElementById("username").value;
    let profilePic = document.getElementById("profilePic").value;

    if (username.trim() === "") {
        alert("يرجى إدخال اسم المستخدم!");
        return;
    }

    alert(`مرحبًا ${username}!`);
}
