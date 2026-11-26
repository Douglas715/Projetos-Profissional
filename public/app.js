const sections = {
  users: ['name', 'email', 'status'],
  courses: ['code', 'title', 'description', 'userId'],
  modules: ['courseId', 'title', 'description', 'userId'],
  contents: ['moduleId', 'title', 'content']
}
const labels = {
  name: 'Name', email: 'Email', status: 'Status', code: 'Code', title: 'Title',
  description: 'Description', userId: 'User', courseId: 'Course',
  moduleId: 'Module', contentId: 'Content', content: 'Content'
}
const relations = { userId: 'users', courseId: 'courses', moduleId: 'modules', contentId: 'contents' }
const editor = document.querySelector('#editor')
const results = document.querySelector('#results')
const status = document.querySelector('#status')
let current = 'courses'
let version = 0
let related = {}

async function request(path, method = 'GET', body) {
  const options = { method }
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(body)
  }
  const response = await fetch(path, options)
  if (response.status === 204) return
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Request failed.')
  return data
}

function button(text, action, type = 'button') {
  const element = document.createElement('button')
  element.textContent = text
  element.type = type
  if (action) element.addEventListener('click', action)
  return element
}

function field(name, value) {
  const label = document.createElement('label')
  label.textContent = labels[name]
  let input
  if (relations[name] || name === 'status') {
    input = document.createElement('select')
    if (relations[name]) input.add(new Option('Select...', ''))
    const choices = name === 'status'
      ? [['Active', 'active'], ['Inactive', 'inactive']]
      : related[name].map(item => [item.name || item.title, item.id])
    for (const [text, id] of choices) input.add(new Option(text, id))
  } else {
    input = document.createElement(name === 'content' ? 'textarea' : 'input')
    if (name === 'email') input.type = 'email'
  }
  input.name = name
  input.required = name !== 'description'
  if (value != null) input.value = value
  label.append(input)
  return label
}

function showTable(rows, fields, actions) {
  results.replaceChildren()
  if (!rows.length) {
    results.textContent = 'No records found.'
    return
  }
  const table = document.createElement('table')
  const header = table.createTHead().insertRow()
  for (const key of actions ? [...fields, 'Actions'] : fields) {
    const cell = document.createElement('th')
    cell.scope = 'col'
    cell.textContent = labels[key] || key.replaceAll('_', ' ')
    header.append(cell)
  }
  const body = table.createTBody()
  for (const item of rows) {
    const row = body.insertRow()
    for (const key of fields) {
      const relation = related[key]?.find(record => record.id === item[key])
      row.insertCell().textContent = relation?.name || relation?.title || item[key] || (item[key] === 0 ? '0' : '')
    }
    if (actions) row.insertCell().append(...actions(item))
  }
  results.append(table)
}

function showEditor(section, item = {}) {
  editor.replaceChildren(...sections[section].map(name => field(name, item[name])))
  editor.append(button(item.id ? 'Save changes' : 'Add record', null, 'submit'))
  if (item.id) editor.append(button('Cancel', () => showEditor(section)))
  editor.onsubmit = async event => {
    event.preventDefault()
    const body = Object.fromEntries(new FormData(editor))
    if (body.description === '') body.description = null
    try {
      await request('/' + section + (item.id ? '/' + encodeURIComponent(item.id) : ''), item.id ? 'PATCH' : 'POST', body)
      if (current === section) await load(section, 'Record saved.')
    } catch (error) {
      status.textContent = error.message
    }
  }
}

async function showReports(token) {
  const reports = [
    ['Users by course count', 'users-most-courses'],
    ['Course with most lessons', 'course-most-contents'],
    ['Course totals', 'courses-metrics'],
    ['Lessons and courses', 'contents-with-course']
  ]
  async function runReport(path) {
    try {
      const rows = await request('/reports/' + path)
      if (token === version) showTable(rows, Object.keys(rows[0] || {}))
    } catch (error) {
      if (token === version) status.textContent = error.message
    }
  }
  const [users, contents] = await Promise.all([request('/users'), request('/contents')])
  if (token !== version) return
  related = { userId: users, contentId: contents }
  for (const [text, path] of reports) editor.append(button(text, () => runReport(path)))
  const user = field('userId')
  const content = field('contentId', contents.find(item => item.id === '2')?.id)
  editor.append(user, content, button('Who watched?', () => {
    const id = content.querySelector('select').value
    if (id) runReport('watched-content/' + encodeURIComponent(id))
  }), button('Mark as watched', null, 'submit'))
  editor.onsubmit = async event => {
    event.preventDefault()
    const data = new FormData(editor)
    try {
      await request('/users/' + encodeURIComponent(data.get('userId')) + '/watched/' + encodeURIComponent(data.get('contentId')), 'PUT')
      status.textContent = 'Lesson marked as watched.'
      await runReport('watched-content/' + encodeURIComponent(data.get('contentId')))
    } catch (error) {
      status.textContent = error.message
    }
  }
}

async function load(section, message = '') {
  current = section
  const token = ++version
  document.querySelector('#heading').textContent = section[0].toUpperCase() + section.slice(1)
  document.querySelectorAll('[data-section]').forEach(element => {
    element.setAttribute('aria-current', String(element.dataset.section === section))
  })
  status.textContent = message
  editor.replaceChildren()
  editor.onsubmit = null
  results.replaceChildren()
  try {
    if (section === 'reports') return await showReports(token)
    const keys = sections[section].filter(name => relations[name])
    const [rows, ...choices] = await Promise.all([
      request('/' + section),
      ...keys.map(name => request('/' + relations[name]))
    ])
    if (token !== version) return
    related = Object.fromEntries(keys.map((name, index) => [name, choices[index]]))
    showEditor(section)
    showTable(rows, sections[section], item => [
      button('Edit', () => showEditor(section, item)),
      button('Delete', async () => {
        if (!window.confirm('Delete this record and any linked records?')) return
        try {
          await request('/' + section + '/' + encodeURIComponent(item.id), 'DELETE')
          if (current === section) await load(section, 'Record deleted.')
        } catch (error) {
          status.textContent = error.message
        }
      })
    ])
  } catch (error) {
    if (token === version) status.textContent = error.message
  }
}

document.querySelectorAll('[data-section]').forEach(element => {
  element.addEventListener('click', () => load(element.dataset.section))
})
load(current)
