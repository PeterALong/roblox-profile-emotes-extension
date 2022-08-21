const emoteAssetId = document.getElementById("emoteAssetId")
const distanceScale = document.getElementById("distanceScale")
const fieldOfViewDeg = document.getElementById("fieldOfViewDeg")
const xRotDeg = document.getElementById("xRotDeg")
const yRotDeg = document.getElementById("yRotDeg")
const go = document.getElementById("go")
chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let url = tabs[0].url
    if(url.includes('catalog')) {
        url = url.match(/\d/g)
        url = url.join('')
        emoteAssetId.value = url
    }
})
distanceScale.oninput = function () {
    document.getElementById("distanceLabel").innerHTML = this.value / 10
}
fieldOfViewDeg.oninput = function () {
    document.getElementById("fieldOfViewLabel").innerHTML = this.value
}
xRotDeg.oninput = function () {
    document.getElementById("xRotLabel").innerHTML = this.value
}
yRotDeg.oninput = function () {
    document.getElementById("yRotLabel").innerHTML = this.value
}
go.onclick = async function () {
    let header
    let goProgress = document.getElementById("goProgress")
    getHeader = $.ajax({
        method: "POST",
        url: "https://auth.roblox.com/v2/login",
        contentType: "application/json",
        success: function () {
            header = getHeader.getResponseHeader('x-csrf-token')
        },
        error: function () {
            header = getHeader.getResponseHeader('x-csrf-token')
        }
    })
    await new Promise(r => setTimeout(r, 500))
    $.ajax({
        method: "POST",
        url: "https://avatar.roblox.com/v1/avatar/thumbnail-customization",
        contentType: "application/json",
        headers: { 'x-csrf-token': header },
        data: JSON.stringify({
            "camera": {
                "distanceScale": distanceScale.value / 10,
                "fieldOfViewDeg": fieldOfViewDeg.value,
                "xRotDeg": xRotDeg.value,
                "yRotDeg": yRotDeg.value
            },
            "emoteAssetId": emoteAssetId.value,
            "thumbnailType": document.querySelector('input[name="shot"]:checked').value
        })
    })
        .then(goProgress.innerHTML = "Success!").fail(error => goProgress.innerHTML = error.responseText)
}