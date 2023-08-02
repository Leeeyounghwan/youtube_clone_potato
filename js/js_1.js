// 처음 화면 로드 시 전체 비디오 리스트 가져오기

getVideoList().then(loadVideo);

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
async function getChannelInfo(channer_name) {
    try {
        let URL = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channer_name}`;
        let response = await fetch(URL, { method: "POST" });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("getChannelInfo()를 실행하던 중에 에러가 발생했습니다. \n에러발생 : ", e);
    }
}

/* home.html에 비디오 리스트 띄우기 */
async function loadVideo() {
    // getVideoList 함수 호출해서 영상 리스트 가져오기
    let videoList = await getVideoList();

    // 가져온 정보를 저장할 videoContainer 생성
    let videoContainer = document.getElementById('videoList');
    let innerHtml = "";

    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    const channelInfoPromises = videoList.map((video) => getChannelInfo(video.video_channel));
    const channelInfoList = await Promise.all(channelInfoPromises);

    // videoList의 값만큼 데이터 불러오기
    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;

        // getVideoInfo에 입력받은 videoId로 정보 가져오기
        let videoInfo = videoInfoList[i];

        let views = Math.floor(videoInfo.views / 1000);
        let dayBefore = asOfToday(videoInfo.upload_date);

        let channelInfo = channelInfoList[i];

        innerHtml += `
            <div class="load-video-info">
                <img src="${videoInfo.image_link}" class="thumbnail-img" onclick='location.href="./video.html?id=${videoId}&channel_name=${channelInfo.channel_name}"' >
                <div>
                    <div style="display: flex;">
                        <a href="./channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}"><img src="${channelInfo.channel_profile}" style="border-radius: 50%; width: 40px; height: 40px;"></a>
                        <div>
                        <p class="thumbnail-title"><a class="thumbnail-title-link" href="./video.html?id=${videoId}&channel_name=${channelInfo.channel_name}">${videoInfo.video_title}</a></p>
                            <div>
                                <p class="thumbnail-channel"><a class="thumbnail-text-link" href="./channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}">${videoInfo.video_channel}</a></p>
                                <p class="thumbnail-channel">${views}K Views, ${dayBefore}일전</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // console.log(innerHtml);
        // 데이터를 div에 삽입
        videoContainer.innerHTML = innerHtml;
    }
}

function asOfToday(upload_date) {
    let uploadDate = new Date(upload_date);
    let currentDate = new Date();

    let minusdate = currentDate - uploadDate
    let dayBefore = minusdate / (1000 * 60 * 60 * 24);
    return Math.floor(dayBefore);
}

/* test.html에서 원하는 영상 클릭시 video_id로 해당 영상 가져와서 video.html에서 재생 */
async function viewVideo(video_id) {
    let videoInfo = await getVideoInfo(video_id);
    let videoContainer = document.getElementById('playVideo');

    let innerHtml = `
        <video class="video" src="${videoInfo.video_link}"
        poster="${videoInfo.image_link}" controls autoplay style="width: 50vw; height: 40vh;" ></video>
    `;

    videoContainer.innerHTML += innerHtml;
}

/* test.html에서 원하는 영상 클릭시 video_id로 해당 영상 정보 가져와서 video.html에 정보출력 */
async function displayVideoInfo(video_id) {
    let videoInfo = await getVideoInfo(video_id);
    let infoContainer = document.getElementById('displayVideoInfo');
    let views = Math.floor(videoInfo.views / 1000);


    let innerHtml = `
            <div
                <div style="display: flex; flex-direction: column;">
                    <div style=" width: 50vw;">
                        <p><h1>${videoInfo.video_title}</h1></p>
                        <p style="color: #AAA; font-family: Roboto; font-size: 12px; font-style: normal; font-weight: 400;">${videoInfo.video_channel}</p>
                        <p style="color: #AAA; font-family: Roboto; font-size: 12px; font-style: normal; font-weight: 400;">${views}K Views, ${videoInfo.upload_date}</p>
                    </div>

                    <div style="display: flex;">
                        <img src="oreumi.jpg" style="border-radius: 50%; width: 4vw; height: 6vh;">
                        <div>
                            <p>${videoInfo.video_channel}</p>
                            <p>${videoInfo.video_detail}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

    infoContainer.innerHTML += innerHtml;
}

/* video.html 우측 영상 리스트 출력하는 함수 */
async function displayVideoList() {
    try {
        // getVideoList 함수를 호출하여 영상 리스트를 가져옵니다.
        let videoList = await getVideoList();

        // 가져온 정보를 저장할 videoContainer를 생성합니다.
        let videoContainer = document.getElementById('displayVideoList');

        // videoList의 값만큼 데이터를 불러옵니다.
        for (let i = 0; i < videoList.length; i++) {
            let videoId = videoList[i].video_id;

            // getVideoInfo에 입력받은 videoId로 정보를 가져옵니다.
            let videoInfo = await getVideoInfo(videoId);

            let views = Math.floor(videoInfo.views / 1000);

            let innerHtml = `
            <div>
                <div class="aside-video">
                <img src="${videoInfo.image_link}" onclick='location.href="./video.html?id=${videoId}&channel_name=${videoInfo.video_channel}"' class="aside-thumbnail">
                    <div style=" width: 204px; flex-direction: column;">
                        <p class="aside-title">${videoInfo.video_title}</p>
                        <p class="aside-text">${videoInfo.video_channel}</p>
                        <p class="aside-text">${views}K 조회수, ${videoInfo.upload_date}</p>
                    </div>
                </div>
            </div>
            `;

            // 데이터를 div에 삽입합니다.
            videoContainer.innerHTML += innerHtml;
        }
    } catch (error) {
        // 비동기 작업 중 발생한 오류를 처리합니다.
        console.error("비디오 목록을 표시하는 동안 오류가 발생했습니다:", error);
    }
}

// 검색 구현 부분 (이부분 아래걸로 계속 해보시면 될거 같은데 아직 해결을 못했습니다 ㅜㅜ)

let searchButton = document.getElementsByClassName("searchButton")[0];
let searchInput = document.getElementsByClassName("searchInput")[0];

// 
searchButton.addEventListener("click", function () {
    let searchKeyword = searchInput.value;
    getVideoList().then((videoList) => {
        let searchResults = videoList.filter((video) =>
            video.video_title.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        loadVideo(searchResults);
    });
});

// searchInput.addEventListener("keypress", function (event) {
//     if (event.keyCode === 13) {
//         let searchKeyword = searchInput.value;
//         getVideoList().then((videoList) => {
//             let searchResults = videoList.filter((video) =>
//                 video.video_title.toLowerCase().includes(searchKeyword.toLowerCase())
//             );
//             loadVideo(searchResults);
//         });
//     }
// });

// 이 부분은 강사님 코드를 응용해봤는데 안 됐어요..2
// searchButton.addEventListener("click", function () {
//     let searchKeyword = searchInput.value;
//     filterVideoList(searchKeyword);
// });

// searchInput.addEventListener("keypress", function (event) {
//     if (event.keyCode === 13) {
//         let searchKeyword = searchInput.value;
//         filterVideoList(searchKeyword);
//     }
// });

// 검색 필터링 시켜줄 함수
// async function filterVideoList() {
//     try {
//         let videoList = await getVideoList();
//         let filterVideoList = videoList.filter((video) => {
//             const videoTitle = video.video_title.toLowerCase();
//             const channelName = video.video_channel.toLowerCase();
//             return videoTitle.includes(searchKeyword.toLowerCase()) || channelName.includes(searchKeyword.toLowerCase());
//         });
//         loadVideo(filterVideoList);
//     } catch (error) {
//         console.error("검색 중 오류가 발생했습니다.", error);
//     }
// }

// 검색 결과를 화면에 표시하는 함수
// async function searchResults() {
// try {
//     // handleSearch 함수를 호출해 검색 결과 가져오기
//     let videoList = await handleSearch(query);

//     // 가져온 정보를 저장할 videoContainer 생성
//     let videoContainer = document.getElementById('videoList');
//     let innerHtml = "";

//     // 비디오 정보와 채널 정보를 병렬로 가져오기
//     const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
//     const videoInfoList = await Promise.all(videoInfoPromises);

//     const channelInfoPromises = videoList.map((video) => getChannelInfo(video.video_channel));
//     const channelInfoList = await Promise.all(channelInfoPromises);

//     // videoList의 값만큼 데이터 불러오기
//     for (let i = 0; i < videoList.length; i++) {
//         let videoInfo = videoInfoList[i];
//         let views = Math.floor(videoInfo.views / 1000);
//         let channelInfo = channelInfoList[i];

//         innerHtml += `
//         <div class="load-video-info">
//             <img src="${videoInfo.image_link}" class="thumbnail-img" onclick='location.href="./video.html?id=${videoId}&channel_name=${channelInfo.channel_name}"' >
//             <div>
//                 <p class="thumbnail-title">${videoInfo.video_title}</p>
//                 <div style="display: flex;">
//                     <img src="${channelInfo.channel_profile}" style="border-radius: 50%; width: 40px; height: 40px;">
//                     <div>
//                         <p class="thumbnail-channel"><a class="thumbnail-text-link" href="./channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}">${videoInfo.video_channel}</a></p>
//                         <p class="thumbnail-channel">${views}K Views, ${videoInfo.upload_date}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;
//     }
//     videoContainer.innerHTML = innerHtml;
// } catch (error) {
//     console.error("검색 결과를 표시하는 동안 오류가 발생했습니다:", error);
// }

// const searchResults = document.querySelector('.serchInput').value;
// const videoList = await getVideoList();
// const infoContainer = document.getElementById('videoList');
// let infoHTML = "";


// }

// 검색창 이벤트 처리
// function handleSearchInput(event) {
//     const query = event.target.value;
//     // 검색어가 비어있지 않은 경우에만 검색 결과를 표시.
//     if (query.trim() !== '') {
//         SearchResults();
//     } else {
//         // 검색어가 비어있는 경우 홈 페이지의 비디오를 표시.
//         loadVideo();
//     }
// }

// // 검색창에 입력 이벤트 리스너를 추가
// const searchInput = document.getElementById('.searchInput');
// searchInput.addEventListener('input', handleSearchInput);

// Enter 키 감지 이벤트 리스너 추가
// const searchInput = document.querySelector('.searchInput');
// searchInput.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//         handleSearchInput(event);
//         event.preventDefault(); // 기본 엔터키 동작 방지
//     }
// });

// 검색어로 영상 검색하기
// async function searchVideos() {
//     const searchInput = document.querySelector('.searchInput').value;

//     // 검색어를 이용하여 서버에 요청 보내기
//     let videoList = await getVideoList();
//     let filteredVideos = videoList.filter(video => video.title.includes(searchInput));

//     // 검색 결과를 처리하여 영상 리스트 생성
//     let videoListDiv = document.getElementById('videoList');
//     videoListDiv.innerHTML = '';

//     filteredVideos.forEach(async video => {
//         let videoInfo = await getVideoInfo(video.video_id);
//         let channelInfo = await getChannelInfo(video.channel_name);

//         let videoElement = document.createElement('div');
//         videoElement.innerHTML = `
//             <div class="load-video-info">
//                 <img src="${videoInfo.image_link}" class="thumbnail-img" onclick='location.href="./video.html?id=${videoId}&channel_name=${channelInfo.channel_name}"' >
//                 <div>
//                     <div style="display: flex;">
//                         <img src="${channelInfo.channel_profile}" style="border-radius: 50%; width: 40px; height: 40px;">
//                         <div>
//                             <p class="thumbnail-title">${videoInfo.video_title}</p>
//                             <div class="thumbnail-channel">
//                                 <p ><a class="thumbnail-text-link" href="./channel.html?channel_name=${channelInfo.channel_name}&id=${videoId}">${videoInfo.video_channel}</a></p>
//                                 <p >${views}K Views, ${videoInfo.upload_date}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;

//         videoListDiv.appendChild(videoElement);
//     });
// }


// // 검색
// function searchVideo(searchKeyword) {
//     // FEED를 초기화해서 기존 영상들을 모두 지우기
//     let feed = document.getElementById("feed");
//     feed.innerHTML = "";

//     // id = 0부터 아이템 불러오기<img src="${videoInfo.image_link}" onclick='location.href="./video.html?id=${videoId}&channel_name=${videoInfo.video_channel}"' class="aside-thumbnail">
//     createVideoItem(0, searchKeyword.toLowerCase());
// }

// // 버튼 클릭 시 searchVideo 함수 호출
// let searchButton = document.getElementById("searchButton");
// let searchBox = document.getElementById("searchBox");

// searchButton.addEventListener("click", function () {
//     let searchKeyword = searchBox.value;
//     searchVideo(searchKeyword);
// });

// // 엔터 키를 눌렀을 때 searchVideo 함수 호출
// searchBox.addEventListener("keypress", function (event) {
//     // 엔터 키의 키 코드는 13입니다.
//     if (event.keyCode === 13) {
//         let searchKeyword = searchBox.value;
//         searchVideo(searchKeyword);
//     }
// });

// 사이드바 스크롤
window.addEventListener('scroll', function () {
    // 현재 스크롤 위치를 계산
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    // 스크롤 위치를 표시할 요소 가져오기
    const scrollIndicator = document.getElementById('scrollIndicator');

    // 표시할 텍스트를 업데이트
    scrollIndicator.textContent = `스크롤 위치: ${scrollPercentage.toFixed(2)}%`;

    // 표시 여부를 결정
    if (scrollTop > 10) {
        scrollIndicator.style.display = 'block';
    } else {
        scrollIndicator.style.display = 'none';
    }
});