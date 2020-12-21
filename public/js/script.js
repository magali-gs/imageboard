
(function () {
    Vue.component("comments-modal", {
        template: "#comments-template",
        props: ["imageId"],
        data: function () {
            return {
                comments: [],
                userComment: "",
                comment: "",
            };
        },
        mounted: function () {
            console.log("props: ", this.imageId);
            var self = this;
            axios
                .get("/comments/" + this.imageId)
                .then(function ({ data }) {
                    self.comments = data;
                })
                .catch(function (error) {
                    console.log("error: ", error);
                });
        },
        watch: {
            imageId: function () {
                console.log("imageId prop just updated");
                var self = this;
                axios
                    .get("/comments/" + this.imageId)
                    .then(function ({ data }) {
                        self.comments = data;
                    })
                    .catch(function (error) {
                        console.log("error: ", error);
                    });
            },
        },

        methods: {
            uploadComment: function (e) {
                console.log("uploadComment");
                var self = this;
                e.preventDefault();
                var commentData = {
                    imageId: this.imageId,
                    comment: this.comment,
                    userComment: this.userComment,
                };
                console.log(commentData);
                axios.post("/comments", commentData).then((res) => {
                    self.comments.unshift(res.data);
                });
            },
        },
    });

    Vue.component("image-modal", {
        template: "#image-template",
        props: ["imageId"],
        data: function () {
            return {
                title: "",
                description: "",
                username: "",
                created_at: "",
                url: "",
                next: "",
                previous: "",
            };
        },
        mounted: function () {
            console.log("props: ", this.imageId);
            var self = this;
            axios
                .get("/highlighted/" + this.imageId)
                .then(function ({ data }) {
 
                    self.title = data[0].title;
                    self.description = data[0].description;
                    self.username = data[0].username;
                    self.created_at = data[0].created_at;
                    self.url = data[0].url;
                    self.previous = data[0].previous;
                    self.next = data[0].next;
                })
                .catch(function (error) {
                    console.log("error: ", error);
                });
        },
        watch: {
            imageId: function () {
                console.log("imageId prop just updated");
                var self = this;
                axios
                    .get("/highlighted/" + this.imageId)
                    .then(function ({ data }) {
                        if (data.length) {
                            console.log(location.hash.slice(1));
                            console.log(data[0].count);
                            self.title = data[0].title;
                            self.description = data[0].description;
                            self.username = data[0].username;
                            self.created_at = data[0].created_at;
                            self.url = data[0].url;
                            self.previous = data[0].previous;
                            self.next = data[0].next;
                        } else {
                            self.$emit("close");
                        }
                    })
                    .catch(function (error) {
                        console.log("error: ", error);
                    });
            },
        },
        methods: {
            closeModal: function () {
                console.log("closeModal click worked");
                this.$emit("close");
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            image: null,
            imageId: location.hash.slice(1),
            hasMore: true
        },
        mounted: function () {
            var self = this;
            axios
                .get("/images")
                .then(function (res) {
                    self.images = res.data;
                })
                .catch(function (error) {
                    console.log("error: ", error);
                });
            addEventListener('hashchange', function(){
                self.imageId = location.hash.slice(1);
            });
        },
        methods: {
            handleFileChange: function (e) {
                this.image = e.target.files[0];
            },
            handleUpload: function (e) {
                e.preventDefault();
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("image", this.image);

                axios.post("/upload", formData).then((res) => {
                    this.images.unshift(res.data);
                });
            },
            closeMe: function () {
                console.log("closeme in the instance");
                history.pushState({}, "", "/");
                this.imageId = null;
            },
            moreImages: function () {
                var self = this;
                console.log("moreImages button worked");
                const lastId = this.images[this.images.length - 1].id;
                axios.get("/more/" + lastId)
                    .then(({ data }) => {
                        data.forEach((element) => {
                            if(element.id == element.lowestId) {
                                self.hasMore = false;
                            }
                            self.images.push(element);
                        });
                    });
            },
        },
    });
})();