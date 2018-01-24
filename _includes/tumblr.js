(function () {

  var list = document.querySelector('.post-list')
  var url = "https://api.tumblr.com/v2/blog/jeffalessandrelli.tumblr.com/posts?api_key=CBqFvQ7v98cDJ7gbXm4WlAQ4mvKxYN9anw1vzbrQWyPvgIjnGO&limit=5"

  fetch(url).then(function (result) {
    return result.json()
  }).then(function (jsonp) {
    displayResults(jsonp)
  })

  function displayResults(jsonp) {
    var posts = jsonp.response.posts

    posts.forEach(function (post) {
      console.log(post);
      var item = document.createElement('li')
      var link = document.createElement('a')

      link.setAttribute('class', 'post-link')
      link.setAttribute('target', '_blank')

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
