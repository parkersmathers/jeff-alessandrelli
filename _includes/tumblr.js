(function () {
  var list = document.querySelector('.tumblr-posts')
  var url = 'https://api.tumblr.com/v2/blog/jeffalessandrelli.tumblr.com/posts?api_key=CBqFvQ7v98cDJ7gbXm4WlAQ4mvKxYN9anw1vzbrQWyPvgIjnGO&limit=10'

  var cachedFetch = function (url, options) {
    var cacheKey = url

    var cached = sessionStorage.getItem(cacheKey)
    if (cached !== null) {
      var response = new Response(new Blob([cached]))
      return Promise.resolve(response)
    }

    return fetch(url, options).then(function (response) {
      if (response.status === 200) {
        var contentType = response.headers.get('Content-Type')
        if (contentType && contentType.match(/application\/json/i)) {
          response.clone().text().then(function (content) {
            sessionStorage.setItem(cacheKey, content)
          })
        }
      }
      return response
    })
  }

  cachedFetch(url)
    .then(res => res.json())
    .then(obj => {
      displayResults(obj)
    }).catch(err => {
      console.log('error displaying tumblr data')
    })

  function displayResults(jsonp) {

    var posts = jsonp.response.posts
    console.log(posts);

    posts.forEach(function (post) {

      var item = document.createElement('li')
      item.classList.add('tumblr-post')

      var link = document.createElement('a')
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener')

      if (post.type === 'photo') {
        var photo = document.createElement('img')
        photo.src = post.photos[0].alt_sizes[0].url

        link.appendChild(photo)

        item.classList.add('tumblr-photo')
        item.appendChild(link)

        if (post.caption !== '') {
          var doc = new DOMParser().parseFromString(post.caption, 'text/html')
          var caption = doc.body.innerHTML
          link.insertAdjacentHTML('afterend', caption)
        }
      }

      if (post.type === 'link') {
        item.classList.add('tumblr-link');
        link.textContent = post.title
        link.href = post.url

        item.appendChild(link)

        if (post.description !== '') {
          var doc = new DOMParser().parseFromString(post.description, 'text/html')
          var comment = doc.body.innerHTML
          link.insertAdjacentHTML('afterend', comment)
        }
      }

      if (post.type === 'text') {
        link.textContent = post.title
        link.href = post.post_url
        var doc = new DOMParser().parseFromString(post.body, 'text/html')
        var body = doc.body.innerHTML

        item.appendChild(link)
        link.insertAdjacentHTML('afterend', body)
      }

      list.appendChild(item)
    })
  }
})()
