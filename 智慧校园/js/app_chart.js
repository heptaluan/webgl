const chartOption = {
  chart_A: {
    color: ['#187ce3', '#29edab', '#fa6a23'],
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}<br/> ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      left: 'center',
      data: ['电', '水', '燃气'],
      bottom: '12px',
      itemWidth: 9,
      itemHeight: 9,
      itemGap: 20,
      icon: 'rect',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.4)',
      },
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '30%',
        style: {
          fontSize: 11,
          fill: '#999999',
          text: '能耗总量',
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '37%',
        z: 10,
        style: {
          text: '33145',
          fill: '#ffffff',
          fontFamily: 'thinnumber',
          fontSize: 34,
          fontWeight: 'normal',
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '52%',
        style: {
          fontSize: 11,
          fill: '#999999',
          text: 'kgce',
        },
      },
    ],
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '43%'],
        label: { show: false },
        silent: true,
        itemStyle: {
          normal: { color: 'rgba(255,255,255,0.07)' },
        },
        data: [{ value: 3812 }],
      },
      {
        type: 'pie',
        radius: ['66%', '70%'],
        center: ['50%', '43%'],
        data: [
          { value: 3812, name: '电' },
          { value: 1231, name: '水' },
          { value: 863, name: '燃气' },
        ],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  },
  chart_B: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    grid: {
      top: '10px',
      left: '5px',
      right: '15%',
      bottom: '-6%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b} : {c} kWh',
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      data: ['夏荣楼', '游泳馆', '艺术楼', '学生食堂', '春华楼', '奔月楼', '中央大楼'],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        textStyle: {
          fontSize: 11,
        },
      },
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          color: 'rgba(255,255,255,0.07)',
        },
        barWidth: 4,
        barGap: '-100%',
        data: [1123, 1123, 1123, 1123, 1123, 1123, 1123],
        animation: false,
      },
      {
        name: '能耗',
        type: 'bar',
        data: [231, 383, 581, 718, 863, 999, 1123],
        barWidth: 4,
        itemStyle: {
          normal: {
            color: '#187ce3',
          },
        },
      },
    ],
  },
  chart_C: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    grid: {
      top: '15px',
      left: '5px',
      right: '15%',
      bottom: '0',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b}日 : {c} kWh',
    },
    xAxis: {
      type: 'category',
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.3)',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
    series: [
      {
        data: [820, 632, 901, 1134, 1090, 1242, 1530, 1020, 1080, 780],
        type: 'line',
        smooth: true,
        symbolSize: 6,
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#000',
            borderColor: '#187ce3',
            borderWidth: 1,
          },
        },
        lineStyle: {
          color: '#187ce3',
        },
      },
      {
        data: [1320, 1157, 1278, 955, 1235, 1398, 1676, 1868, 1555, 1555],
        type: 'line',
        smooth: true,
        symbolSize: 6,
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#000',
            borderColor: '#fa6a23',
            borderWidth: 1,
          },
        },
        lineStyle: {
          color: '#fa6a23',
        },
      },
    ],
  },
  chart_D: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '29%',
        style: {
          fontSize: 11,
          fill: 'rgba(255, 255, 255, 0.4)',
          text: '设备数量',
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '36%',
        z: 10,
        style: {
          text: '1370',
          fill: '#ffffff',
          fontFamily: 'thinnumber',
          fontSize: 20,
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '58%',
        style: {
          text: '设备在线率',
          fill: 'rgba(255, 255, 255, 0.4)',
          fontSize: 11,
        },
      },
    ],
    grid: {
      top: '12',
      left: '0',
      bottom: '25px',
      right: '0',
    },
    series: [
      {
        name: 'shadow',
        type: 'gauge',
        center: ['50%', '50%'], // 仪表位置
        radius: '90%', //仪表大小
        startAngle: 220, //开始角度
        endAngle: -40, //结束角度
        max: 100,
        axisLine: {
          lineStyle: {
            color: [[1, 'rgba(255,255,255,0.07)']],
            width: 20,
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        detail: {
          show: false,
        },
      },
      {
        name: 'online',
        type: 'gauge',
        center: ['50%', '50%'], // 仪表位置
        radius: '83%', //仪表大小
        startAngle: 220, //开始角度
        endAngle: -40, //结束角度
        max: 100,
        axisLine: {
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [
              [
                1,
                new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: '#fa6a23',
                    },
                    {
                      offset: 0.4,
                      color: '#29edab',
                    },
                    {
                      offset: 1,
                      color: '#187ce3',
                    },
                  ],
                  false
                ),
              ],
            ],
            width: 5,
          },
        },
        splitLine: {
          length: 5,
          lineStyle: {
            // 属性lineStyle控制线条样式
            width: 1,
            color: 'rgba(0,0,0,0.4)',
          },
        },
        axisTick: {
          //刻度线样式（及短线样式）
          length: 5,
          lineStyle: {
            // 属性lineStyle控制线条样式
            width: 1,
            color: 'rgba(0,0,0,0.4)',
          },
        },
        axisLabel: {
          //文字样式（及“10”、“20”等文字样式）
          show: false,
        },
        detail: {
          formatter: '{score|{value}}',
          offsetCenter: [0, '60%'],
          height: 30,
          rich: {
            score: {
              color: '#ffffff',
              fontFamily: 'thinnumber',
              fontSize: 35,
            },
          },
        },
        data: [
          {
            value: 86,
            itemStyle: { color: 'rgba(255,255,255,0.5)' },
          },
        ],
        pointer: {
          //指针样式
          length: '90%',
          width: '4px%',
        },
      },
    ],
  },
  chart_E: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    grid: {
      top: '15%',
      left: '5px',
      right: '10',
      bottom: '-15%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b} : {c} kWh',
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      data: ['其他', '智能', '排水', '给水', '动力', '照明', '暖通'],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        textStyle: {
          fontSize: 11,
        },
      },
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          color: 'rgba(255,255,255,0.07)',
        },
        barWidth: 4,
        barGap: '-100%',
        data: [1123, 1123, 1123, 1123, 1123, 1123, 1123],
        animation: false,
      },
      {
        name: '能耗',
        type: 'bar',
        data: [231, 383, 581, 718, 863, 999, 1123],
        barWidth: 4,
        itemStyle: {
          normal: {
            color: '#187ce3',
          },
        },
      },
    ],
  },
  chart_F: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    grid: {
      top: '15px',
      left: '5px',
      right: '0',
      bottom: '4%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b}日 : {c} kWh',
    },
    xAxis: {
      type: 'category',
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.3)',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
    series: [
      {
        data: [1120, 1357, 1278, 955, 1235, 1398, 1876, 1568, 1255, 1555],
        type: 'line',
        smooth: true,
        symbolSize: 6,
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#000',
            borderColor: '#29edab',
            borderWidth: 1,
          },
        },
        lineStyle: {
          color: '#29edab',
        },
      },
      {
        type: 'bar',
        barWidth: 4,
        itemStyle: {
          normal: {
            color: '#187ce3',
          },
        },
        data: [620, 157, 278, 355, 235, 998, 676, 868, 525, 555],
      },
      {
        type: 'bar',
        barWidth: 4,
        itemStyle: {
          normal: {
            color: '#fa6a23',
          },
        },
        barGap: '0',
        data: [560, 186, 238, 325, 155, 798, 606, 968, 545, 515],
      },
    ],
  },
  chart_G: {
    color: ['#187ce3', '#29edab', '#fa6a23', '#5e49c7'],
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}<br/> ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '8%',
      data: ['空调', '照明', '动力', '其他'],
      top: 'middle',
      itemWidth: 9,
      itemHeight: 9,
      itemGap: 30,
      icon: 'rect',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.4)',
      },
    },
    graphic: [
      {
        type: 'text',
        left: '29%',
        top: '34%',
        style: {
          fontSize: 11,
          fill: '#999999',
          text: '能耗总量',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        left: '22%',
        top: '42%',
        z: 10,
        style: {
          text: '33145',
          fill: '#ffffff',
          fontFamily: 'thinnumber',
          fontSize: 40,
          fontWeight: 'normal',
          textAlign: 'center',
          //fontStyle: 'italic'
        },
      },
      {
        type: 'text',
        left: '33%',
        top: '60%',
        style: {
          fontSize: 11,
          fill: '#999999',
          text: 'kW',
          textAlign: 'center',
        },
      },
    ],
    series: [
      {
        type: 'pie',
        radius: ['64%', '86%'],
        center: ['36%', '50%'],
        label: { show: false },
        silent: true,
        itemStyle: {
          normal: { color: 'rgba(255,255,255,0.07)' },
        },
        data: [{ value: 3812 }],
      },
      {
        type: 'pie',
        radius: ['72%', '76%'],
        center: ['36%', '50%'],
        data: [
          { value: 3812, name: '空调' },
          { value: 1231, name: '照明' },
          { value: 863, name: '动力' },
          { value: 398, name: '其他' },
        ],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  },
  chart_H: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    grid: {
      top: '15px',
      left: '0',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b}日 : {c} kWh',
    },
    xAxis: {
      type: 'category',
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.3)',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
    series: [
      {
        data: [1120, 1357, 1278, 955, 1235, 1398, 1876, 1568, 1255, 1555],
        type: 'line',
        smooth: true,
        symbolSize: 6,
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#000',
            borderColor: '#29edab',
            borderWidth: 1,
          },
        },
        lineStyle: {
          color: '#29edab',
        },
      },
      {
        type: 'bar',
        barWidth: 4,
        itemStyle: {
          normal: {
            color: '#187ce3',
          },
        },
        data: [620, 157, 278, 355, 235, 998, 676, 868, 525, 555],
      },
      {
        type: 'bar',
        barWidth: 4,
        itemStyle: {
          normal: {
            color: '#fa6a23',
          },
        },
        barGap: '0',
        data: [560, 186, 238, 325, 155, 798, 606, 968, 545, 515],
      },
    ],
  },
  chart_I: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    tooltip: {
      position: 'top',
      formatter: '{b}时 : {c} kW',
    },
    grid: {
      top: '6%',
      left: '3%',
      bottom: 0,
      right: '2%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.1)',
          type: 'dotted',
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        margin: 15,
        textStyle: {
          fontSize: 11,
        },
      },
    },
    series: [
      {
        name: 'Punch Card',
        type: 'scatter',
        symbolSize: function (val) {
          return val[2] * 2
        },
        data: [
          [0, 0, 5],
          [1, 0, 1],
          [2, 0, 0],
          [3, 0, 0],
          [4, 0, 0],
          [5, 0, 0],
          [6, 0, 0],
          [7, 0, 0],
          [8, 0, 0],
          [9, 0, 0],
          [10, 0, 0],
          [11, 0, 2],
          [12, 0, 4],
          [13, 0, 1],
          [14, 0, 1],
          [15, 0, 3],
          [16, 0, 4],
          [17, 0, 6],
          [18, 0, 4],
          [19, 0, 4],
          [20, 0, 3],
          [21, 0, 3],
          [22, 0, 2],
          [23, 0, 5],
          [0, 1, 7],
          [1, 1, 0],
          [2, 1, 0],
          [3, 1, 0],
          [4, 1, 0],
          [5, 1, 0],
          [6, 1, 0],
          [7, 1, 0],
          [8, 1, 0],
          [9, 1, 0],
          [10, 1, 5],
          [11, 1, 2],
          [12, 1, 2],
          [13, 1, 6],
          [14, 1, 9],
          [15, 1, 11],
          [16, 1, 6],
          [17, 1, 7],
          [18, 1, 8],
          [19, 1, 12],
          [20, 1, 5],
          [21, 1, 5],
          [22, 1, 7],
          [23, 1, 2],
          [0, 2, 1],
          [1, 2, 1],
          [2, 2, 0],
          [3, 2, 0],
          [4, 2, 0],
          [5, 2, 0],
          [6, 2, 0],
          [7, 2, 0],
          [8, 2, 0],
          [9, 2, 0],
          [10, 2, 3],
          [11, 2, 2],
          [12, 2, 1],
          [13, 2, 9],
          [14, 2, 8],
          [15, 2, 10],
          [16, 2, 6],
          [17, 2, 5],
          [18, 2, 5],
          [19, 2, 5],
          [20, 2, 7],
          [21, 2, 4],
          [22, 2, 2],
          [23, 2, 4],
          [0, 3, 7],
          [1, 3, 3],
          [2, 3, 0],
          [3, 3, 0],
          [4, 3, 0],
          [5, 3, 0],
          [6, 3, 0],
          [7, 3, 0],
          [8, 3, 1],
          [9, 3, 0],
          [10, 3, 5],
          [11, 3, 4],
          [12, 3, 7],
          [13, 3, 14],
          [14, 3, 13],
          [15, 3, 12],
          [16, 3, 9],
          [17, 3, 5],
          [18, 3, 5],
          [19, 3, 10],
          [20, 3, 6],
          [21, 3, 4],
          [22, 3, 4],
          [23, 3, 1],
          [0, 4, 1],
          [1, 4, 3],
          [2, 4, 0],
          [3, 4, 0],
          [4, 4, 0],
          [5, 4, 1],
          [6, 4, 0],
          [7, 4, 0],
          [8, 4, 0],
          [9, 4, 2],
          [10, 4, 4],
          [11, 4, 4],
          [12, 4, 2],
          [13, 4, 4],
          [14, 4, 4],
          [15, 4, 14],
          [16, 4, 12],
          [17, 4, 1],
          [18, 4, 8],
          [19, 4, 5],
          [20, 4, 3],
          [21, 4, 7],
          [22, 4, 3],
          [23, 4, 0],
          [0, 5, 2],
          [1, 5, 1],
          [2, 5, 0],
          [3, 5, 3],
          [4, 5, 0],
          [5, 5, 0],
          [6, 5, 0],
          [7, 5, 0],
          [8, 5, 2],
          [9, 5, 0],
          [10, 5, 4],
          [11, 5, 1],
          [12, 5, 5],
          [13, 5, 10],
          [14, 5, 5],
          [15, 5, 7],
          [16, 5, 11],
          [17, 5, 6],
          [18, 5, 0],
          [19, 5, 5],
          [20, 5, 3],
          [21, 5, 4],
          [22, 5, 2],
          [23, 5, 0],
          [0, 6, 1],
          [1, 6, 0],
          [2, 6, 0],
          [3, 6, 0],
          [4, 6, 0],
          [5, 6, 0],
          [6, 6, 0],
          [7, 6, 0],
          [8, 6, 0],
          [9, 6, 0],
          [10, 6, 1],
          [11, 6, 0],
          [12, 6, 2],
          [13, 6, 1],
          [14, 6, 3],
          [15, 6, 4],
          [16, 6, 0],
          [17, 6, 0],
          [18, 6, 0],
          [19, 6, 0],
          [20, 6, 1],
          [21, 6, 2],
          [22, 6, 2],
          [23, 6, 6],
        ],
        animationDelay: function (idx) {
          return idx * 5
        },
        itemStyle: {
          normal: {
            color: '#187ce3',
          },
        },
      },
    ],
  },
}
