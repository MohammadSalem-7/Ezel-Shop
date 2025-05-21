// تعريف السلة
let cart = [];

// سعر صرف الدولار إلى الجنيه
const exchangeRate = 31;

// إضافة المنتج للسلة
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const productCard = button.closest(".product-card");
    const productName = productCard.dataset.name;
    const price = parseFloat(productCard.dataset.price);

    cart.push({ name: productName, price: price });
    updateCart();
  });
});

// تحديث واجهة السلة
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const totalAmount = document.getElementById("totalAmount");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - $${item.price} / ${(
      item.price * exchangeRate
    ).toFixed(0)} EGP`;
    cartItems.appendChild(li);
    total += item.price;
  });

  totalAmount.textContent = `$${total.toFixed(2)} / ${(
    total * exchangeRate
  ).toFixed(0)} EGP`;
}

// إتمام الطلب
function checkout() {
  const orderNumber = Math.floor(Math.random() * 1000000); // رقم طلب عشوائي
  const customerName = prompt("أدخل اسمك:");

  if (!customerName) {
    alert("يجب إدخال الاسم لإتمام الطلب.");
    return;
  }

  const orderDetails = {
    customerName: customerName,
    orderNumber: orderNumber,
    items: cart,
    totalUSD: totalAmount.textContent.split("/")[0].trim(),
    totalEGP: totalAmount.textContent.split("/")[1].trim()
  };

  // إرسال الطلب إلى Discord Webhook
  sendOrderToDiscord(orderDetails);
}

// إرسال الطلب إلى Discord
function sendOrderToDiscord(orderDetails) {
  const webhookUrl =
    "https://discord.com/api/webhooks/1374722953853272176/3A-LL4AaL2rxqVmTSt0wpN6TKs5v74zCX8q_9EyIO46Mo2GDjislF28YNH_VfefH7JB7";
  const roleId = "1372895307267838012"; // ID بتاع رول @store

  const message = {
    content: `<@&${roleId}> طلب جديد:\n\n**العميل:** ${
      orderDetails.customerName
    }\n**رقم الطلب:** ${orderDetails.orderNumber}\n**المجموع:** ${
      orderDetails.totalUSD
    } / ${
      orderDetails.totalEGP
    }\n\n**تفاصيل المنتجات:**\n${orderDetails.items
      .map(
        item =>
          `- ${item.name} - $${item.price} / ${(
            item.price * exchangeRate
          ).toFixed(0)} EGP`
      )
      .join("\n")}`,
    allowed_mentions: {
      roles: [roleId]
    }
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  })
    .then(response => {
      if (response.ok) {
        alert(
          `تم تأكيد الطلب وإرساله بنجاح!\nرقم طلبك: ${orderDetails.orderNumber}\nاحفظ رقم الطلب لمتابعة طلبك في الديسكورد.`
        );
        cart = []; // إعادة تعيين السلة
        updateCart();
      } else {
        alert("فشل في إرسال الطلب. حاول مرة أخرى.");
      }
    })
    .catch(error => {
      alert("حدث خطأ أثناء إرسال الطلب.");
      console.error("Error:", error);
    });
}
