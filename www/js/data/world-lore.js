/* Chính sử và truyền thuyết Cửu Châu, độc lập với trạng thái trò chơi. */
(function(root){
 "use strict";
 const ages=[
  {title:"Thái Cổ · Cửu mạch sơ khai",text:"Chín dòng linh mạch hội tụ dưới Thiên Kiêu Sơn. Những người hái thuốc, thợ rèn và ẩn sĩ đầu tiên học cách dẫn linh khí vào thân. Thuở ấy chưa có tông môn; tri thức được truyền bên bếp lửa và trên những thẻ tre."},
  {title:"Thượng Cổ · Linh mạch phân tranh",text:"Khi linh mạch suy kiệt, các thế lực tranh đoạt động phủ. Sáu truyền thừa cùng cứu chữa vùng đất bị tàn phá: kiếm tu bảo vệ đường núi, đan sư cứu người, pháp tu dựng trận, cổ tu khảo cứu nguồn mạch, u tu ngăn tâm ma, y tu hồi sinh thảo mộc. Từ đó hình thành sáu đại tông môn."},
  {title:"Trung Cổ · Lập Thiên Bảng",text:"Sau đại loạn, các tông môn lập ước giao lưu và khảo nghiệm thay cho tranh đoạt lãnh địa. Trên đỉnh Thiên Kiêu Sơn xuất hiện một kim bảng tự khắc tên tu sĩ. Không ai biết ai tạo ra nó. Người đời gọi những quy luật mà bảng tuân theo là Thiên Đạo."},
  {title:"Hiện thế · Nguyên Lưu xuất hiện",text:"Một trang mệnh thư để trắng được phát hiện trong cổ khố phía tây. Cùng thời, lớp thiên kiêu mới nổi lên, các tông môn lại mở cửa thu đồ. Câu chuyện của đạo hữu bắt đầu giữa thời đại ấy."}
 ];
 const chapters={
  origin:["Ngươi tỉnh lại bên một án thư cũ, ngoài hiên mưa rơi trên mái ngói. Trong ký ức vẫn còn một thế giới xa lạ, nơi tri thức được tích lũy qua từng buổi học. Người giữ cổ khố tìm khắp mệnh thư mà chẳng thấy lai lịch của ngươi, bèn gọi ngươi là Nguyên Lưu Chi Chủ.",
  "Có người cho rằng trang mệnh thư trống là dấu hiệu của một cổ nhân trở về; kẻ khác cho rằng đó chỉ là sai sót của thiên cơ. Chưa có ai chứng thực lời đồn. Ngươi bắt đầu từ Luyện Khí, phải tích lũy linh lực và vượt qua khảo nghiệm như mọi tu sĩ.",
  "Mỗi buổi học là một lần nhập định, mỗi nhiệm vụ hoàn thành là một nét mực trên mệnh thư. Thân thế còn bỏ ngỏ; đạo lộ do chính ngươi viết tiếp."],
  lands:["Cửu Châu là tên toàn đại lục. Thiên Kiêu Sơn ở trung tâm và cổ khố phía tây là hai thánh địa chung, nơi các tông môn gặp gỡ và gìn giữ thư tịch.",
  "Dương Châu có Thái Hư Điện; Hoài Châu có Hồ Linh Tâm và Vạn Pháp Các; Thanh Châu là đất kiếm tu; Lạc Châu nổi danh đan dược; Ký Châu có Cửu U Cốc; Ung Châu nuôi dưỡng y tu Bách Thảo Đường.",
  "Tùng Châu có rừng sâu và kỳ ngộ; Tứ Châu có Lôi Đài Thiên Kiếp, nơi đạo tâm và tu vi được khảo nghiệm; Tề Châu tập trung thương lộ và Càn Khôn Bảo Khố. Lữ khách, tán tu và thương nhân nối liền chín vùng đất."],
  rivals:["Lăng Tiêu Hàn xem việc tranh vị trên Thiên Kiêu Bảng là phép thử ý chí. Mạc Vô Cực thường được nhắc đến cùng những kỳ ngộ hiếm có. Tần Hạo Thiên dựa vào Hỗn Độn Thánh Thể để tích lũy tu vi qua con đường của riêng mình.",
  "Bạch Nhược Hư theo đuổi Đạo Vận, Hạ Trường Ca có thể hóa họa vi phúc. Cố Thái Hư mang truyền thừa Thái Hư Cổ Long: đạo pháp của ông chú trọng tích lũy bền vững và tránh suy giảm trước biến động. Ba con đường ấy khiến giới tu hành luôn tranh luận về vận, họa và sự bền bỉ.",
  "Thiên kiêu còn có những người ít được nhắc tên, những tán tu âm thầm tiến bộ và đệ tử vừa nhập môn. Thứ hạng và tông môn của họ được ghi theo diễn biến từng kiếp. Danh tiếng có thể đổi chủ khi tu vi thay đổi."],
  law:["Đạo lộ gồm Luyện Khí, Trúc Cơ, Kim Đan, Nguyên Anh, Hóa Thần, Luyện Hư, Hợp Thể, Đại Thừa và Chân Tiên. Tám cảnh đầu chia chín tầng; Chân Tiên không chia tầng. Phi Thăng Kiếp là cửa ải trên đường thành tiên.",
  "Thiên kiếp được định theo thời hạn của kiếp tu luyện. Tu vi và kết quả khảo nghiệm quyết định thành bại; thất bại hao Mệnh, có thể dẫn đến Thiên Đạo Trừng Phạt. Người chịu phạt vẫn phải tiếp tục tu luyện. Nhiệm vụ phục hồi và điều kiện ân xá được ghi trong Thiên Đạo.",
  "Một kiếp mặc định dài 119 ngày, có thể đổi theo thiết lập kiếp sau. Đến hạn, tu sĩ luân hồi. Tu vi, vật phẩm và các duyên của kiếp cũ được đặt lại; ký lục, truyền thừa được giữ theo luật luân hồi. Trừng phạt còn theo sang kiếp mới nếu chưa đạt điều kiện ân xá."],
  life:["Mỗi sáng, đệ tử mở nhật trình; người đến giảng đường, người luyện kiếm, người đối chiếu đan phương. Khi đêm xuống, các sơn môn dần tắt đèn. Tu luyện bền lâu cần cả công phu lẫn nghỉ ngơi.",
  "Ở Tùng Châu, kỳ ngộ có thể đem đến linh thú hoặc một cơ duyên khó đoán. Tại Tề Châu, bảo vật được trao đổi bằng linh lực. Các tông môn tranh tài theo tuần; thiên kiêu cũng có tính tình và duyên gặp gỡ riêng.",
  "Đạo Văn lưu dấu những lần đột phá và những sự kiện đã xảy ra với đạo hữu. Những trang ấy, cùng kết quả tu luyện từng kiếp, dần trở thành chính sử của riêng ngươi."]
 };
 const sectTraditions=[
  "Đệ tử lấy sự chuyên chú làm gốc, luyện một thức đến khi hiểu thấu mới học thức tiếp.",
  "Đan sư chép lại cả những mẻ đan thất bại; mỗi sai sót là một bài học truyền cho người sau.",
  "Pháp tu thường đối chiếu nhiều kinh điển, tìm mối liên hệ giữa các môn học và phép tu.",
  "Cổ tu khảo cứu thẻ tre, cổ trận và nền móng của đạo pháp, coi trọng tích lũy lâu dài.",
  "U tu nghiên cứu tâm ma và sai lầm, giữ truyền thống đối diện với hậu quả của lựa chọn.",
  "Y tu chăm sóc linh thảo và đồng môn, coi việc giữ sức khỏe là một phần của đạo lộ."
 ];
 const aspirations=Object.freeze({
  "Vô Song":"Dùng thực học chứng minh danh hiệu Vô Song.",
  "Lăng Tiêu Hàn":"Chấn hưng Thái Dương hậu duệ, tranh ngôi đầu Thiên Kiêu Bảng.",
  "Mạc Vô Cực":"Thấu hiểu Vận Đạo qua những cơ duyên trên đường tu hành.",
  "Liễu Như Yên":"Tìm con đường của mình giữa biến động và vận mệnh.",
  "Tần Hạo Thiên":"Tìm hiểu khởi nguyên Hỗn Độn và vạn loại linh khí.",
  "Giang Thừa Ảnh":"Rèn thành Bất Diệt Kim Thân, hoàn thành tâm nguyện của Thiết Giáp tộc.",
  "Phong Vân Tử":"Thấu hiểu thiên cơ và nhân quả.",
  "Đường Thanh Liên":"Giữ đạo tâm thanh tịnh, ngộ đạo giữa vạn linh.",
  "Bạch Nhược Hư":"Vượt qua giới hạn thiên tư bằng con đường Đạo Vận của riêng mình.",
  "Hạ Trường Ca":"Hội tụ tinh hoa trăm nhà thành đại đạo riêng.",
  "Cố Thái Hư":"Tu từng bước vững chắc, lĩnh hội truyền thừa Thái Hư Cổ Long."
 });
 root.GameWorldLore=Object.freeze({ages,chapters,sectTraditions,aspirations});
})(typeof window!=="undefined"?window:globalThis);
