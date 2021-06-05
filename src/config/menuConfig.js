import {
    PieChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    UserOutlined,
    HomeOutlined,
    AppstoreOutlined,
    BarsOutlined,
    ToolOutlined,
    AreaChartOutlined,
    SafetyCertificateOutlined,

  } from '@ant-design/icons';
const menuList = [ 
    { 
        title: '首页', // 菜单标题名称 
        key: '/home', // 对应的path 
        icon: <HomeOutlined />, // 图标名称 
    },
    { 
        title: '商品', 
        key: '/products', 
        icon: <AppstoreOutlined />, 
        children: 
        [ // 子菜单列表 
            { 
                title: '品类管理', 
                key: '/category', 
                icon: <BarsOutlined />
            },
            { 
                title: '商品管理', 
                key: '/product', 
                icon: <ToolOutlined />
            }, 
        ] 
    },
]  


export default menuList