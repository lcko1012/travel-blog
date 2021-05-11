import avatar from './avatar.jpg'


export const PostData = [
    {
        id: "1",
        title: "Biển đà nẵng có đẹp như lời đồn?",
        slug: "Bien-da-nang-co-dep-khong",
        content:  "",
        author: "Kieu Oanh",
        bookmark: 12,
        comments: [
            {
                
                auth: {
                    name: "Anh da đen",
                    avatar: "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
                },
                comment: "Viết gì mà dở ẹc"
            },
            {
                auth: {
                    name: "Anh da trắng",
                    avatar: "https://cdn.icon-icons.com/icons2/1736/PNG/512/4043260-avatar-male-man-portrait_113269.png"
                },
                comment: "Hay quá bạn ơi"
            },
            {
                auth: {
                    name: "Anh da vàng",
                    avatar: "https://i.pinimg.com/originals/fa/02/02/fa0202572e8aa734cedb154c413a4846.jpg"
                },
                comment: "Đọc xong mà không muốn đi luôn"
            }
        ]
    },
    {
        id: "2",
        title: "Hồ nước thiên đường ở Quảng Trị",
        content:  "",
        author: "STEVEN",
        bookmark: 12,
    }
]