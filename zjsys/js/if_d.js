function getPara() {
  var search = document.location.search

  var pattern = new RegExp('[?&]para' + '=([^&]+)', 'g')
  var matcher = pattern.exec(search)
  var items = null
  if (null != matcher) {
    try {
      items = decodeURIComponent(decodeURIComponent(matcher[1]))
    } catch (e) {
      try {
        items = decodeURIComponent(matcher[1])
      } catch (e) {
        items = matcher[1]
      }
    }
  }
  return items
}

var LC = echarts.init(document.getElementById('dc_line'))
var ZC1 = echarts.init(document.getElementById('dc_bar1'))
var ZC2 = echarts.init(document.getElementById('dc_bar2'))

var optionl = {
  grid: {
    top: '20px',
    left: '40px',
    bottom: '25px',
    right: '15px',
  },
  textStyle: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLabel: {
      textStyle: {
        fontSize: 11,
      },
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.2)',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: function (p) {
        return parseInt(p)
      },
      textStyle: {
        fontSize: 11,
      },
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.2)',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
  },
  series: [
    {
      data: [820, 932, 901, 934, 1320, 1100, 1220],
      type: 'line',
      areaStyle: {},
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(54,153,255,0.7)',
            },
            {
              offset: 1,
              color: 'rgba(54,153,255,0.1)',
            },
          ]),
          lineStyle: {
            width: 2,
            type: 'solid',
            color: 'rgb(54,153,255)',
          },
        },
      },
      symbolSize: 0,
    },
  ],
}

var optionz1 = {
  textStyle: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  grid: {
    top: '15px',
    left: '5px',
    right: '20px',
    bottom: '5px',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    axisLabel: {
      formatter: function (p) {
        return parseInt(p)
      },
      textStyle: {
        fontSize: 11,
      },
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.2)',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'category',
    data: ['StaA', 'StaB', 'StaC', 'StaD', 'StaE'],
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.2)',
      },
    },
    axisTick: {
      show: false,
    },
    offset: 0,
    nameTextStyle: {
      fontSize: 11,
    },
  },
  series: [
    {
      name: '数量',
      type: 'bar',
      data: [718, 581, 231, 383, 863],
      barWidth: 5,
      barGap: 10,
      smooth: true,
      label: {
        normal: {
          show: true,
          position: 'right',
          offset: [0, 2],
          textStyle: {
            color: 'rgba(255,255,255,0.5)',
            fontSize: 11,
          },
        },
      },
      itemStyle: {
        emphasis: {
          barBorderRadius: 2,
        },
        normal: {
          barBorderRadius: 2,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#69b418' },
            { offset: 1, color: '#9df045' },
          ]),
        },
      },
    },
  ],
}

var optionz2 = {
  textStyle: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  grid: {
    top: '15px',
    left: '5px',
    right: '20px',
    bottom: '5px',
    containLabel: true,
  },
  xAxis: {
    data: ['类目1', '类目2', '类目3', '类目4', '类目5', '类目6'],
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.2)',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.2)',
      },
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    offset: 0,
    nameTextStyle: {
      fontSize: 11,
    },
  },
  series: [
    {
      name: '出租车信息',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
      barMaxWidth: 13,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: '#ff7800' },
            { offset: 1, color: '#ffbf36' },
          ]),
        },
      },
    },
  ],
}

window.onload = function () {
  document.getElementById('test').innerHTML = getPara()

  LC.setOption(optionl)
  ZC1.setOption(optionz1)
  ZC2.setOption(optionz2)
}
