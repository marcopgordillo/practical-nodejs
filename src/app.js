const app = require('derby').createApp(module)

app.get('/', (page, model, _arg, next) => {
  snippetId = model.add('snippets',
  {
    snippetName: _arg.snippetName,
    code: 'var'
  })

  return page.redirect('/' + snippetId)
})

app.get('/:snippetId', (page, model, param, next) => {
  const snippet = model.at('snippets.' + param.snippetId)
  snippet.subscribe((err) => {
    if (err) return next(err)
    console.log(snippet.get())
    model.ref('_page.snippet', snippet)
    page.render()
  })
})

app.ready((model) => {
  editor.setValue(model.get('_page.snippet.code'))

  model.on('change', '_page.snippet.code', () => {
    if (editor.getValue() !== model.get('_page.snippet.code')) {
      process.nextTick(() => {
        editor.setValue(model.get('_page.snippet.code'), 1)
      })
    }
  })

  editor.getSession().on('change', (e) => {
    // console.log(editor.getValue(), editor.getValue() !== model.get('_page.snippet.code'))
    if (editor.getValue() !== model.get('_page.snippet.code')) {
      process.nextTick(() => {
        model.set('_page.snippet.code', editor.getValue())
      })
    }
  })
})
