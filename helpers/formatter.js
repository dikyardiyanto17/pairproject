function dateFormat(date){
    options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }
      return new Intl.DateTimeFormat('en', options).format(date)
}

module.exports = dateFormat