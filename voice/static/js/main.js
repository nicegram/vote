window.onload = function () {

	/**
	 * Requests component
	 */
	Vue.component('requests-section', {

		template: '#requests-template',

		props: ['type', 'title'],

		data: function () {
			return {
				requests: {},
				error: false,
				loaded: false,
				api: {
					requests: 'https://thevoice.yuriy.gr/requests',
				},
				newRequest: '',
				lengthLimit: 255
			}
		},

		mounted: function () {
			this.fetchRequests(this.type);
		},

		computed: {
			newRequestLength: function () {
				return this.newRequest.length;
			}
		},

		methods: {
			fetchRequests: function (type) {

				var params = {params: {type: type} };

				this.$http.get(this.api.requests + '.getByType', params)
				.then(function(response) {
					if (response.body.status === 'success')
						this.requests = response.body.requests;
	
					if (response.body.status === 'error')
						console.error(response.body.message);
				})
				.catch(function() {
					this.error = true;
				})
				.finally(function() {
					this.loaded = true;
				});
			},
			submitRequest: function (newRequest, event) {

				event.preventDefault();

				event.target.disabled = true;

				var formData = new FormData();
				formData.append('request_text', newRequest);

				this.$http.post(this.api.requests + '.addRequest', formData)
				.then(function(response) {
					if (response.body.status === 'success')
						this.requests.unshift(response.body.request);

					if (response.body.status === 'error')
						console.error(response.body.massage);
				})
				.catch(function(error) {
					console.error(error);
				})
				.finally(function() {
					event.target.disabled = false;
					this.newRequest = '';
				});
			},
			submitVote: function (request_id, event) {
				event.preventDefault();

				event.target.disabled = true;

				var formData = new FormData();
				formData.append('request_id', request_id);

				this.$http.post(this.api.requests + '.addVote', formData)
				.then(function(response) {
					if (response.body.status === 'success') {
						var len = this.requests.length;
						for (var i = 0; i < len; i++) {
							if (this.requests[i]['id'] == request_id) {
								this.requests[i]['vote'] = response.body.request.vote;
								break;
							}
						}
					}

					if (response.body.status === 'error')
						console.error(response.body.massage);
				})
				.catch(function(error) {
					console.error(error);
				})
				.finally(function() {
					event.target.disabled = false;
				});
			},
			getClassByStatus: function (status) {
				return status.toLowerCase().split(' ').join('-');
			}
		}

	});

	/**
	 * Main application
	 */
	var app = new Vue({

		el: '#app',

		created: function () {
			// Ну вообще юмор
			console.info('Мамкин хакер сильно?');
		}
	});

}