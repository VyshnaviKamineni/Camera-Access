document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('camera');
    const captureBtn = document.getElementById('captureBtn');
    const goBackBtn = document.getElementById('goBackBtn');
    const canvas = document.getElementById('canvas');
    const imagesContainer = document.getElementById('imagesContainer');
    const cityInfo = document.getElementById('cityInfo');

    let stream;
    let imageIndex = 1;

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simple validation (you may want to enhance this)
        if (!name || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Simulate signup success (you would replace this with a server request)
        showCameraContainer();
    });

    captureBtn.addEventListener('click', function () {
        captureImage();
        // The location is already captured when the camera screen is opened
    });

    goBackBtn.addEventListener('click', function () {
        showSignupForm();
    });

    function showCameraContainer() {
        signupForm.style.display = 'none';
        cameraContainer.style.display = 'block';

        // Check if the browser supports the necessary APIs
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((mediaStream) => {
                    stream = mediaStream;
                    video.srcObject = mediaStream;

                    // Capture the user's location when the camera screen is opened
                    captureUserLocation();
                })
                .catch((error) => {
                    console.error('Error accessing camera:', error);
                });
        } else {
            alert('Your browser does not support the necessary APIs to access the camera.');
        }
    }

    function showSignupForm() {
        signupForm.style.display = 'block';
        cameraContainer.style.display = 'none';

        // Stop the camera stream
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
    }

    function captureImage() {
        // Draw the current video frame onto the canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        // Create an image element to display the captured image
        const capturedImage = document.createElement('img');
        capturedImage.src = canvas.toDataURL('image/png');
        capturedImage.alt = 'Captured Image ' + imageIndex;

        // Append the image to the container
        imagesContainer.appendChild(capturedImage);

        // Increment the image index for unique alt attributes
        imageIndex++;
    }

    function captureUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    displayCityInfo(latitude, longitude);
                },
                function (error) {
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported in this browser.');
        }
    }

    function displayCityInfo(latitude, longitude) {
        // You can display or use the latitude and longitude as needed
        cityInfo.innerHTML = `Current Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
});
