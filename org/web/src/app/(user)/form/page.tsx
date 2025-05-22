'use client';
import React, { useState, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  fullName: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  zaloPhoneNumber: string;
  email: string;
  facebookLink: string;
  userType: string;
  otherUserType: string;
  schoolOrWorkPlace: string;
  city: string;
  highSchoolName: string;
  programsSelected: string[];
  infoSources: string[];
  otherInfoSource: string;
  consent: boolean;
}

const initialFormData: FormData = {
  fullName: '',
  dob: '',
  gender: '',
  phoneNumber: '',
  zaloPhoneNumber: '',
  email: '',
  facebookLink: '',
  userType: '',
  otherUserType: '',
  schoolOrWorkPlace: '',
  city: '',
  highSchoolName: '',
  programsSelected: [],
  infoSources: [],
  otherInfoSource: '',
  consent: false,
};

const RegistrationForm: React.FC = () => {
  const router = useRouter();
  const effectRan = useRef(false); // flag nhớ trạng thái

  useLayoutEffect(() => {
    if (effectRan.current) return; // nếu đã chạy rồi thì không chạy nữa
    effectRan.current = true;
    const fromHome = sessionStorage.getItem('fromHome');
    if (fromHome === 'true') {
      sessionStorage.removeItem('fromHome');
    } else {
      router.replace('/home');
    }
  }, []);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  // Các nguồn thông tin
  const infoSourcesOptions = [
    'Bạn bè',
    'Facebook:  Fanpage',
    'Website:',
    'Email',
    'SMS',
    'Bandroll, Poster',
    'Tờ giới thiệu',
    'Google',
    'Sự kiện, ngày hội việc làm',
  ];

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim())
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.dob.trim())
      newErrors.dob = 'Vui lòng nhập ngày tháng năm sinh';
    // if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại thường dùng';
    } else if (!/^\d{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại thường dùng không hợp lệ';
    }

    if (
      formData.zaloPhoneNumber.trim() &&
      !/^\d{10,11}$/.test(formData.zaloPhoneNumber)
    ) {
      newErrors.zaloPhoneNumber = 'Số điện thoại Zalo không hợp lệ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email thường dùng';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.userType) newErrors.userType = 'Vui lòng chọn bạn là ai';
    if (formData.userType === 'Mục khác' && !formData.otherUserType.trim()) {
      newErrors.otherUserType = 'Vui lòng ghi rõ mục khác';
    }

    // if (formData.infoSources.length === 0) {
    //   newErrors.infoSources = 'Vui lòng chọn ít nhất một nguồn thông tin';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, type, value, checked } = target;

      if (type === 'checkbox') {
        if (name === 'programsSelected') {
          let newPrograms = [...formData.programsSelected];
          if (checked) {
            if (!newPrograms.includes(value)) newPrograms.push(value);
          } else {
            newPrograms = newPrograms.filter((p) => p !== value);
          }
          setFormData((prev) => ({ ...prev, programsSelected: newPrograms }));
        } else if (name === 'infoSources') {
          let newSources = [...formData.infoSources];
          if (checked) {
            if (!newSources.includes(value)) newSources.push(value);
          } else {
            newSources = newSources.filter((s) => s !== value);
          }
          setFormData((prev) => ({ ...prev, infoSources: newSources }));
        } else if (name === 'consent') {
          setFormData((prev) => ({ ...prev, consent: checked }));
        }
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      const { name, value } = target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Dữ liệu không hợp lệ, vui lòng kiểm tra kỹ lại');
      return; // Dừng gửi form nếu validation thất bại
    }
    let courseName = '';
    let className = '';
    if (typeof window !== 'undefined') {
      const savedDataString = localStorage.getItem('formData');

      if (savedDataString) {
        const savedData = JSON.parse(savedDataString); // parse JSON thành object
        courseName = savedData.courseName;
        className = savedData.className;
      }
    }

    const now = new Date();
    try {
      const response = await fetch('http://localhost:3000/api/submitform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_name: formData.fullName,
          date_of_birth: formData.dob,
          gender: formData.gender,
          email: formData.email,
          phone_number: formData.phoneNumber,
          zalo_phone: formData.zaloPhoneNumber,
          link_facebook: formData.facebookLink,
          current_education_level: formData.userType,
          other_education_level_description: formData.otherUserType,
          high_school_name: formData.highSchoolName,
          city: formData.city,
          source: formData.infoSources
            .filter((src) => src !== 'Khác')
            .join(', '),
          current_status: 'No contact yet',
          registration_date: now.toLocaleString(),
          status_change_date: 'null',
          student_created_at: 'null',
          student_updated_at: 'null',
          assigned_counselor_name: 'null',
          assigned_counselor_email: 'null',
          assigned_counselor_type: 'null',
          interested_courses_details: courseName + '___' + className,
          student_status_history: 'null',
          last_consultation_date: 'null',
          last_consultation_duration_minutes: 'null',
          last_consultation_notes: 'null',
          last_consultation_type: 'null',
          last_consultation_status: 'Contact',
          last_consultation_counselor_name: 'null',
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi gửi dữ liệu');
      }

      const result = await response.json();
      console.log('Phản hồi từ server:', result);

      // Nếu muốn, bạn có thể chuyển trang hoặc reset form ở đây
      // router.push('/thank-you'); hoặc setFormData(initialFormData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 "
    >
      <h2 className="text-3xl font-bold mb-4">
        📝 Đăng ký tư vấn chương trình đào tạo tại CUSC
      </h2>

      {/* I. Thông tin cá nhân */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold mb-2">I. Thông tin cá nhân</legend>
        {/* Email đăng ký */}
        <div>
          <label htmlFor="email" className="block font-semibold">
            Email đăng ký: <span className="text-red-600">(Bắt buộc)</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        {/* Họ và tên */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block font-medium">
            Họ và tên: <span className="text-red-600">(Bắt buộc)</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Ngày tháng năm sinh */}
        <div className="mb-4">
          <label htmlFor="dob" className="block font-medium">
            Ngày tháng năm sinh:{' '}
            <span className="text-red-600">(Bắt buộc)</span>
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded ${
              errors.dob ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dob && (
            <p className="text-red-600 text-sm mt-1">{errors.dob}</p>
          )}
        </div>

        {/* Giới tính */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Giới tính:</label>
          <div className="flex space-x-6">
            {['Nam', 'Nữ', 'Khác'].map((genderOption) => (
              <label
                key={genderOption}
                className="inline-flex items-center space-x-2"
              >
                <input
                  type="radio"
                  name="gender"
                  value={genderOption}
                  checked={formData.gender === genderOption}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span>{genderOption}</span>
              </label>
            ))}
          </div>
          {/* {errors.gender && (
            <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
          )} */}
        </div>

        {/* Số điện thoại thường dùng */}
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block font-medium">
            Số điện thoại thường dùng:{' '}
            <span className="text-red-600">(Bắt buộc)</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Số điện thoại Zalo */}
        <div className="mb-4">
          <label htmlFor="zaloPhoneNumber" className="block font-medium">
            Số điện thoại sử dụng Zalo (nếu khác):
          </label>
          <input
            type="tel"
            id="zaloPhoneNumber"
            name="zaloPhoneNumber"
            value={formData.zaloPhoneNumber}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded ${
              errors.zaloPhoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.zaloPhoneNumber && (
            <p className="text-red-600 text-sm mt-1">
              {errors.zaloPhoneNumber}
            </p>
          )}
        </div>

        {/* Facebook link */}
        <div className="mb-4">
          <label htmlFor="facebookLink" className="block font-medium">
            Link Facebook đang sử dụng:
          </label>
          <input
            type="url"
            id="facebookLink"
            name="facebookLink"
            value={formData.facebookLink}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded border-gray-300"
          />
        </div>

        {/* Bạn là */}
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Bạn là: <span className="text-red-600">(Bắt buộc)</span>
          </label>
          <div className="space-y-2 space-x-3">
            {[
              'Học sinh THCS',
              'Học sinh THPT',
              'Sinh viên',
              'Người đi làm',
              'Mục khác',
            ].map((option) => (
              <label
                key={option}
                className="inline-flex items-center space-x-2"
              >
                <input
                  type="radio"
                  name="userType"
                  value={option}
                  checked={formData.userType === option}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {formData.userType === 'Mục khác' && (
            <input
              type="text"
              name="otherUserType"
              value={formData.otherUserType}
              onChange={handleChange}
              placeholder="Ghi rõ"
              className={`mt-2 w-full p-2 border rounded ${
                errors.otherUserType ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}
          {errors.userType && (
            <p className="text-red-600 text-sm mt-1">{errors.userType}</p>
          )}
          {errors.otherUserType && (
            <p className="text-red-600 text-sm mt-1">{errors.otherUserType}</p>
          )}
        </div>
      </fieldset>

      {/* II. Thông tin học tập */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold mb-2">II. Thông tin học tập</legend>

        {/* Trường đang học */}
        <div className="mb-4">
          <label htmlFor="highSchoolName" className="block font-medium">
            Tên trường đang học (nếu là học sinh/sinh viên):
          </label>
          <input
            type="text"
            id="highSchoolName"
            name="highSchoolName"
            value={formData.highSchoolName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded border-gray-300"
          />
        </div>

        {/* Tỉnh/thành phố */}
        <div className="mb-4">
          <label htmlFor="city" className="block font-medium">
            Tỉnh / Thành phố bạn đang sinh sống:
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded border-gray-300"
          />
        </div>
      </fieldset>
      {/* IV. Bạn biết thông tin qua kênh nào */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold mb-2">
          III. Bạn biết thông tin qua kênh nào?
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
          {infoSourcesOptions.map((source) => (
            <label key={source} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                name="infoSources"
                value={source}
                checked={formData.infoSources.includes(source)}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span>{source}</span>
            </label>
          ))}

          {/* Thêm option 'Khác' */}
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="infoSources"
              value="Khác"
              checked={formData.infoSources.includes('Khác')}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span>Khác</span>
          </label>
        </div>
        {/* {errors.infoSources && (
          <p className="text-red-600 text-sm mt-1">{errors.infoSources}</p>
        )} */}
      </fieldset>

      {/* V. Đồng ý nhận thông báo */}
      {/* <fieldset className="border p-4 rounded">
        <legend className="font-semibold mb-2">
          IV. Đồng ý nhận thông báo từ CUSC
        </legend>
        <label className="inline-flex items-center space-x-5 ">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>
            Nhận thông tin mới nhất qua các kênh Email, Facebook, Zalo, SMS về
            sự kiện, hoạt động cộng đồng, tuyển sinh, công nghệ…
          </span>
        </label>
      </fieldset> */}

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Đăng ký
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
