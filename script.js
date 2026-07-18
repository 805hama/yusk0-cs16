function updateServerInfo() {
    fetch("/status")
        .then(response => response.json())
        .then(data => {
            document.getElementById("status").textContent =
                data.online ? "ONLINE" : "OFFLINE";

            document.getElementById("servername").textContent = data.name;
            document.getElementById("map").textContent = data.map;
            document.getElementById("players").textContent = data.players;
            document.getElementById("maxplayers").textContent = data.maxplayers;
            document.getElementById("vac").textContent =
                data.vac ? "有効" : "無効";
            document.getElementById("os").textContent = data.os;
        })
        .catch(error => {
            document.getElementById("status").textContent = "取得失敗";
            console.error(error);
        });
}

updateServerInfo();           // 初回
setInterval(updateServerInfo, 1000); // 1秒ごと