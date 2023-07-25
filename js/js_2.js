async function getVideoList() {
    try {
        const response = await fetch('http://oreumi.appspot.com/video/getVideoList')
    } catch (error) {
        console.error('Error')
    }
}

async function displayVideoList() {
    try {
        const videoList = await getVideoList();
    } catch (error) {
        console.error('Error')
    }
}