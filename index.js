async function fetchGetJSON(url) {
  const init = {
    method: 'GET',
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    },
  }

  const response = await fetch(url, init)
  const respBody = await response.text()
  return respBody
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

  const respBody = fetchGetJSON('https://cfw-takehome.developers.workers.dev/api/variants')

  const body = await respBody

  const body1 = JSON.parse(body)["variants"];

  const response1 = await fetch(body1[0])
  const response2 = await fetch(body1[1])

  let response;

  const cookie = request.headers.get('cookie')
  if (cookie && cookie.includes(`cookie=resp1`)) {
    response = response1
  } else if (cookie && cookie.includes(`cookie=resp2`)) {
    response = response2
  } else {
    let selected_response = Math.random() < 0.5 ? 'resp1' : 'resp2';
    let res = selected_response === 'resp1' ? response1 : response2
    res = new Response(res.body, res);
    res.headers.set('Set-Cookie', `cookie=${selected_response}; path=/`)
    response = res
  }

  final = new HTMLRewriter().on("p", {
    element: el => {
      el.after("By Sudeendra Shenoy");
    }
  }).on("title", {
    element: el => {
      el.setInnerContent("My new title");
    }
  }).on("a#url", {
    element: el => {
      el.setInnerContent("Go to www.google.com");
    }
  }).on("a#url", {
    element: el => {
      el.setAttribute("href", "https://www.google.com/");
    }
  }).transform(response)

  return final

}