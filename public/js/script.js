new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: '',
        username: '',
        image: null
    },
    mounted: function () {
        var self = this;
        axios
            .get("/images")
            .then(function (response) {
                self.images = response.data;
            })
            .catch(function (error) {
                console.log("error: ", error);
            });
    },
    methods: { 
        handleFileChange: function(e) {
            console.log("e.target.files", e.target.files);
            //update the image property
            this.image = e.target.files[0];
        },
        handleUpload: function(e) {
            //prevent default behavior
            e.preventDefault();
            //POST data to the /uploads path with axios
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("image", this.image);

            axios.post("/upload", formData).then((res) => {
                this.images.unshift(res.data);
            });
        }
    }
});