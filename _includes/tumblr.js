(function () {

  var list = document.querySelector('.post-list')
  var url = 'https://api.tumblr.com/v2/blog/jeffalessandrelli.tumblr.com/posts?api_key=CBqFvQ7v98cDJ7gbXm4WlAQ4mvKxYN9anw1vzbrQWyPvgIjnGO&limit=5'

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
      console.log('error getting tumblr data')
    })

  function displayResults(jsonp) {
    var posts = jsonp.response.posts

    posts.forEach(function (post) {
      // console.log(post);
      var item = document.createElement('li')
      var link = document.createElement('a')

      link.setAttribute('class', 'post-link')
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener')

      if (post.type === 'photo') {
        var image = document.createElement('img')
        var doc = new DOMParser().parseFromString(post.caption, 'text/html')
        var caption = doc.body.innerHTML

        image.src = post.photos[0].alt_sizes[3].url

        link.appendChild(image)
        image.insertAdjacentHTML('afterend', caption)
        item.appendChild(link)
      }

      if (post.type === 'link') {
        link.textContent = post.title
        link.href = post.url
        var doc = new DOMParser().parseFromString(post.description, 'text/html')
        var comment = doc.body.innerHTML

        item.appendChild(link)
        link.insertAdjacentHTML('afterend', comment)
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
