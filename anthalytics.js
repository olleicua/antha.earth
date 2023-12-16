/* global moment, BarChart, _ */

function getAllPageViews(callback) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function() {
    const obj = JSON.parse(this.response);
    callback(obj.views);
  });
  xhr.open("GET", "https://anthalytics.glitch.me/page_views");
  xhr.send();
}

const years = {};

function ResultElement({$summary, clusivity}) {
  let $result = $summary.querySelector(`.search-count.${clusivity}clusive`);
  if (!$result) {
    $result = document.createElement('span');
    $result.classList.add('search-count');
    $result.classList.add(clusivity);
    $summary.append($result);
  }
  return $result;
}

function displaySearchResults($details) {
  displaySearchResult({$details, clusivity: 'in'});
  displaySearchResult({$details, clusivity: 'ex'});
}

function displaySearchResult({$details, clusivity}) {
  const inputKey = `${clusivity}clusiveSearchInput`;
  const pattern = new RegExp(window.Anthalytics[inputKey].value, 'g');
  const $$views = $details.querySelectorAll('.view');
  let matchCount = {
    in: 0,
    ex: $$views.length
  }[clusivity];
  for (let i = 0; i < $$views.length; i++) {
    let $time = $$views[i].querySelector('.time').textContent,
        $url = $$views[i].querySelector('.url').textContent,
        $userAgent = $$views[i].querySelector('.user-agent').textContent;
    if ($time.match(pattern) || $url.match(pattern) || $userAgent.match(pattern)) {
      switch (clusivity) {
        case 'in':
          matchCount++;
          break;
        case 'ex':
          matchCount--;
          break;
      }
    }
  }
  const $summary = $details.querySelector('summary');

  const searchCount = ResultElement({$summary, clusivity});
  searchCount.textContent = `${clusivity}clusive search matches: ${matchCount}`;
}

function applySearch() {
  const yearKeys = Object.keys(years);
  for (let i = 0; i < yearKeys.length; i++) {
    let year = years[yearKeys[i]];
    displaySearchResults(year.element);
    const monthKeys = Object.keys(year.months);
    for (let j = 0; j < monthKeys.length; j++) {
      let month = year.months[monthKeys[j]];
      displaySearchResults(month.element);
      const dayKeys = Object.keys(month.days);
      for (let k = 0; k < dayKeys.length; k++) {
        let day = month.days[dayKeys[k]];
        displaySearchResults(day);
      }
    }
  }
}

function createSummary(container, text) {
  const summary = document.createElement('summary');
  container.append(summary);
  
  const label = document.createElement('span');
  label.classList.add('label');
  label.textContent = text;
  summary.append(label);

  const count = document.createElement('span');
  count.classList.add('count');
  count.n = 0;
  count.textContent = `total: ${count.n}`;
  summary.append(count);
}

function getOrCreateYear(container, year) {
  if (years[year]) return years[year];
  
  years[year] = {
    months: {},
    element: document.createElement('details')
  };
  years[year].element.classList.add('year');
  container.append(years[year].element);
  createSummary(years[year].element, year);

  if (moment().format('YYYY') === year) {
    years[year].element.setAttribute('open', true);
  }

  return years[year];
}

function getOrCreateMonth(year, month) {
  if (year.months[month]) return year.months[month];
  
  year.months[month] = {
    days: {},
    element: document.createElement('details')
  };
  year.months[month].element.classList.add('month');
  year.element.append(year.months[month].element);
  createSummary(year.months[month].element, month);

  if (moment().format('MMMM') === month) {
    year.months[month].element.setAttribute('open', true);
  }

  return year.months[month];
}

function getOrCreateDay(month, day) {
  if (month.days[day]) return month.days[day];
  
  month.days[day] = document.createElement('details');
  month.days[day].classList.add('day');
  month.element.append(month.days[day]);
  createSummary(month.days[day], day);
  
  if (moment().format('Do') === day) {
    month.days[day].setAttribute('open', true);
  }
  
  buildTabs(month.days[day]);

  return month.days[day];
}

function handleTabClick(event) {
  const tab = event.target;
  const container = tab.parentElement;
  const pageClass = tab.getAttribute('data-tab-page');
  const page = container.querySelector(`.tab-page.${pageClass}`);
  const allTabsAndPages = container.querySelectorAll('.tab, .tab-page');
  
  for (let i = 0; i < allTabsAndPages.length; i++) {
    allTabsAndPages[i].classList.remove('active');
  }
  tab.classList.add('active');
  page.classList.add('active');
}

function buildTabs(container) {
  const chartTab = document.createElement('div');
  chartTab.classList.add('tab', 'active');
  chartTab.setAttribute('data-tab-page', 'bar-chart');
  chartTab.textContent = 'chart';
  chartTab.addEventListener('click', handleTabClick);
  container.append(chartTab);

  const viewTab = document.createElement('div');
  viewTab.classList.add('tab');
  viewTab.setAttribute('data-tab-page', 'views');
  viewTab.textContent = 'views';
  viewTab.addEventListener('click', handleTabClick);
  container.append(viewTab);

  const barChart = document.createElement('div');
  barChart.classList.add('tab-page', 'bar-chart', 'active');
  container.chart = new BarChart({
    xAxisLabels: _.range(24),
    height: 300
  });
  container.chart.appendTo(barChart);
  container.append(barChart);

  const views = document.createElement('div');
  views.classList.add('tab-page', 'views');
  container.append(views);
}

function incrementSummaryCount(element) {
  const summary = element.querySelector('summary');
  const count = summary.querySelector('.count');
  count.n++;
  count.textContent = `total: ${count.n}`;
}

function displayView(container, view) {
  const viewMoment = moment(view.time);
  const year = getOrCreateYear(container, viewMoment.format('YYYY'));
  incrementSummaryCount(year.element);

  const month = getOrCreateMonth(year, viewMoment.format('MMMM'));
  incrementSummaryCount(month.element);

  const day = getOrCreateDay(month, viewMoment.format('Do'));
  incrementSummaryCount(day);
  
  day.chart.plot(viewMoment.hour());
  
  const viewContainer = day.querySelector('.views');
  const viewElement = document.createElement('div');
  viewElement.classList.add('view');
  viewContainer.append(viewElement);

  const time = document.createElement('span');
  time.classList.add('time');
  time.textContent = viewMoment.format('HH:mm:ss.sss');
  viewElement.append(time);

  const url = document.createElement('span');
  url.classList.add('url');
  url.textContent = view.url;
  viewElement.append(url);

  const userAgent = document.createElement('span');
  userAgent.classList.add('user-agent');
  userAgent.textContent = view.user_agent;
  viewElement.append(userAgent);
}
function toggleTracking() {
  const status = localStorage.getItem('anthalytics-tracking');
  localStorage.setItem(
    'anthalytics-tracking',
    status === 'disabled' ? 'enabled' : 'disabled'
  );
  drawTrackingUi();
}

function drawTrackingUi() {
  const disabled = localStorage.getItem('anthalytics-tracking') === 'disabled';
  
  window.Anthalytics.trackingStatus.textContent =
    `anthalytics ${disabled ? 'not ' : ''}is currently tracking this browser's activity on ${location.host}`
  window.Anthalytics.trackingButton.textContent =
    `${disabled ? 'enable' : 'disable'} tracking`
}

window.Anthalytics = {
  logPageView: function() {
    if (localStorage.getItem('anthalytics-tracking') === 'disabled') return;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://anthalytics.glitch.me/page_view', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("url=" + encodeURIComponent(location.href));
  },
  displayData: function(container) {
    getAllPageViews(function(views) {
      for (let i = 0; i < views.length; i++)  {
        displayView(container, views[i]);
      }
      applySearch();
    });
    window.Anthalytics.inclusiveSearchInput = container.querySelector('.controls .regex-search.inclusive');
    window.Anthalytics.exclusiveSearchInput = container.querySelector('.controls .regex-search.exclusive');
    window.Anthalytics.searchButton = container.querySelector('.controls .apply-search');
    window.Anthalytics.searchButton.addEventListener('click', applySearch);

    window.Anthalytics.trackingStatus = container.querySelector('.controls .tracking-status');
    window.Anthalytics.trackingButton = container.querySelector('.controls .toggle-tracking');
    window.Anthalytics.trackingButton.addEventListener('click', toggleTracking);
    drawTrackingUi();
  }
}; 

