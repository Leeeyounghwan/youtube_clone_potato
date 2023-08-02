/* 비디오 리스트 가져오기 */
async function getVideoList() {
    try {
        let response = await fetch('http://oreumi.appspot.com/video/getVideoList');
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getVideoList()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}

/* 입력받은 video_id로 영상정보 가져오기 */
async function getVideoInfo(video_id) {
    try {
        let URL = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${video_id}`;
        let response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getVideoInfo()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}

/* 입력받는 채널의 정보 가져오기 */
async function getChannelInfo(channel_name) {
    try {
        let URL = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channel_name}`;
        let response = await fetch(URL, { method: "POST" });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getVideoInfo()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}


/* 현재 날짜가 영상 업로드일로 부터 몇일이 지났는지 계산 */
function asOfToday(upload_date) {
    let uploadDate = new Date(upload_date);
    let currentDate = new Date();

    let minusdate = currentDate - uploadDate
    let dayBefore = minusdate / (1000 * 60 * 60 * 24);
    return Math.floor(dayBefore);
}

async function displayVideoTitle(video_id) {
    let videoInfo = await getVideoInfo(video_id);
    let infoContainer = document.getElementById('displayVideoTitle');
    let infoContainer2 = document.getElementById('infoText');
    let views = Math.floor(videoInfo.views / 1000);
    let dayBefore = asOfToday(videoInfo.upload_date);

    let innerHtml = `
        <div>
            <p class="video-title">${videoInfo.video_title}</p>
        </div>
        `;

    let innerHtml2 = `
        <div>
            <p class="video-detail">${views}K Views, ${dayBefore}일전</p>
        </div>
    `;

    infoContainer.innerHTML += innerHtml;
    infoContainer2.innerHTML = innerHtml2;
}

/* home.html에서 원하는 영상 클릭시 video_id로 해당 영상 정보 가져와서 video.html에 정보출력 */
async function displayVideoInfo(video_id) {
    let videoInfo = await getVideoInfo(video_id);
    let infoContainer = document.getElementById('displayVideoInfo');
    let channelInfo = await getChannelInfo(videoInfo.video_channel);

    // 구독자수 계산
    subscribers = parseInt(channelInfo.subscribers);
    sub = ""
    if (subscribers < 1000) {
        sub = subscribers + "";
    }
    else if (subscribers < 1000000) {
        sub = Math.round(subscribers / 1000) + "K";
    }
    else if (subscribers < 100000000000) {
        sub = Math.round(subscribers / 1000000) + "M";
    }
    else {
        sub = Math.round(subscribers / 1000000000) + "B";
    }


    let innerHtml = `
            <div class="channel-info-box" style="display: flex; flex-direction: row;">
                <a href="./channel.html?channel_name=${channelInfo.channel_name}&id=${video_id}"><img src="${channelInfo.channel_profile}" class="channel-img"></a>
                    <div class="channel-info-text">
                        <p id="${videoInfo.video_channel}"><a class="channel-link" href="./channel.html?channel_name=${channelInfo.channel_name}&id=${video_id}">${videoInfo.video_channel}</a></p>
                        <p>${sub} Subscribers</p>
                    </div>
            </div>
        `;

    infoContainer.innerHTML += innerHtml;
}


/* video.html 우측 영상 리스트 출력하는 함수 */
async function displayVideoList() {
    // getVideoList 함수 호출해서 영상 리스트 가져오기
    let videoList = await getVideoList();

    // 가져온 정보를 저장할 videoContainer 생성
    let videoContainer = document.getElementById('displayVideoList');

    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);


    // videoList의 값만큼 데이터 불러오기
    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;

        // getVideoInfo에 입력받은 videoId로 정보 가져오기
        let videoInfo = videoInfoList[i];

        let views = Math.floor(videoInfo.views / 1000);
        let dayBefore = asOfToday(videoInfo.upload_date);

        let innerHtml = `
            <div class="aside-video">
                <img src="${videoInfo.image_link}" onclick='location.href="./video.html?id=${videoId}&channel_name=${videoInfo.video_channel}"' class="aside-thumbnail">
                <div class="aside-text-content">
                    <p class="aside-title"><a class="thumbnail-title-link" href="./video.html?id=${videoId}&channel_name=${videoInfo.video_channel}">${videoInfo.video_title}</a></p>
                    <p class="aside-text"><a class="thumbnail-channel-link" href="./channel.html?channel_name=${videoInfo.video_channel}&id=${videoId}">${videoInfo.video_channel}</p>
                    <p class="aside-text">${views}K Views, ${dayBefore}일전</p>
                </div>
            </div>
        `;

        // 데이터를 div에 삽입
        videoContainer.innerHTML += innerHtml;
    }
}

/* 댓글창 작성, 취소버튼 노출 이벤트 */
let input = document.querySelector("#commentInput");
let buttons = document.getElementById("comment-buttons");

input.onfocus = function (e) {
    buttons.style.display = "flex";
}
input.onblur = function (e) {
    buttons.style.display = "none";
    input.value = "";
}

// /* 구독 버튼 이벤트 */
let flag1 = 1;
function subscribeChannel() {
    subscribes = document.getElementById("channel-subscribes");
    if (flag1 == 1) {
        flag1 = 0;
        subscribes.style.backgroundColor = "#dbdbdb";
        subscribes.value = "SUBSCRIBING";
        subscribes.style.color = "black";
    }
    else {
        flag1 = 1;
        subscribes.style.backgroundColor = "#C00";
        subscribes.value = "SUBSCRIBES";
        subscribes.style.color = "white";
    }
}
