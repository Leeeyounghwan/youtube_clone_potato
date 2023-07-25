function getChannelVideo() {
    let channelName = document.getElementById('channelName').value;     // 채널명 가져오기
    console.log(channelName);

    let xhr = new XMLHttpRequest();     // GET/POST 요청을 보낼 수 있게 해주는 함수
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {        // reqadyState가 잘 받아졌을 때 처리

            /* 데이터를 한개씩 가져올 때 사용(인덱스 값 부여) */
            // window.alert(xhr.status);        // 응답코드 확인
            // if (xhr.status === 200) {      // 응답코드가 200이라면
            //     let data = JSON.parse(xhr.responseText);     // data에 응답된 JSON 데이터를 가져오기
            //     let channelInfo = '';
            //     channelInfo += '<h2>' + data[0].video_channel + '<h2>';
            //     channelInfo += '<h2>' + data[0].video_detail + '<h2>';
            //     channelInfo += '<p><strong>채널명 : </strong>' + data[0].video_channel + '</p>';
            //     console.log(data[0].video_channel);
            //     console.log(data[0].video_detail);
            //     document.getElementById('channelInfo').innerHTML = channelInfo;
            // }
            // else {
            //     alert('채널 정보를 가져오는데 실패했습니다.');
            // }

            /* 검색된 모든 데이터 가져올 때 사용 */
            if (xhr.status === 200) {      // 응답코드가 200이라면(정상적으로 가져왔다면)
                let data = JSON.parse(xhr.responseText);     // data에 응답된 데이터를 삽입
                let channelInfo = '';
                for (let i = 0; i < Object.keys(data).length; i++) {        // data에 들어있는 만큼 데이터를 출력하기.
                    channelInfo += getVideo(data[i].video_id);
                    channelInfo += '<p><strong>채널명 : </strong>' + data[i].video_title + '</p>';
                    channelInfo += '<p>업로드일 : ' + data[i].upload_date + '</p>';
                    // console.log(channelInfo);
                }
                document.getElementById('channelInfo').innerHTML = channelInfo;
            }
            else if (channelName === "") {
                alert('채널 정보를 가져오는데 실패했습니다. \n채널명을 입력해주세요.');
            }
            else {
                alert('채널 정보를 가져오는데 실패했습니다.');
            }
        }
    };

    xhr.open('POST', encodeURI('http://oreumi.appspot.com/channel/getChannelVideo?video_channel=' + channelName), true);
    xhr.send();
}


/** 에러 발생 - 23.07.25
 * 검색된 채널에 대한 관련 영상들의 썸네일과 영상url을 가져오려고 했는데
 * 실패했습니다.. 밑에 로그를 찍어보면 잘 들어가는거 같긴한데
 * 보내는 다시 getChannelVideo로 보내는 방법을 모르겠어요....
 * */
function getVideo(video_id) {        // 검색된 video의 썸네일과 url 가져오기
    let videoId = video_id     // getChannelVideo함수에서 가져온 videoId
    console.log(videoId);

    let xhr = new XMLHttpRequest();     // GET/POST 요청을 보낼 수 있게 해주는 함수

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {        // reqadyState가 잘 받아졌을 때 처리

            if (xhr.status === 200) {      // 응답코드가 200이라면(정상적으로 가져왔다면)
                let data = JSON.parse(xhr.responseText);     // data에 응답된 데이터를 삽입
                let videoThumbnail = '';

                videoThumbnail += '<a href = "' + data.video_link + '"><img src = "' + data.image_link + '"></a>';
                console.log(videoThumbnail);
            }
            else if (videoId === "") {
                alert('영상 정보를 가져오는데 실패했습니다. \n재생하려는 영상을 다시 클릭해주세요.');
            }
            else {
                alert('영상 정보를 가져오는데 실패했습니다.');
            }
        }
    };

    xhr.open('GET', encodeURI('http://oreumi.appspot.com/video/getVideoInfo?video_id=' + videoId), true);
    xhr.send();
}