import { useState } from 'react'
import { Accordion } from './Accordion'
import { ImageCard } from './ImageCard'

const accordionItems = [
  {
    id: 'cancer',
    title: 'السرطان',
    content: 'التعرض الطويل لبعض المواد الكيميائية قد يزيد من خطر الإصابة بالأورام السرطانية.',
  },
  {
    id: 'respiratory',
    title: 'مشاكل الجهاز التنفسي',
    content: 'استنشاق الأبخرة الكيميائية قد يسبب ضيق في التنفس أو أمراض مزمنة.',
  },
  {
    id: 'digestive',
    title: 'مشاكل الهضم',
    content: 'ملامسة المواد أو ابتلاعها قد يؤدي إلى اضطرابات في الجهاز الهضمي.',
  },
  {
    id: 'skin',
    title: 'مشاكل الجلد',
    content: 'التعرض المباشر قد يسبب التهابات أو حروق جلدية.',
  },
]

export function LessonAccordionsImage() {
  const [openId, setOpenId] = useState(accordionItems[0].id)

  const handleToggle = (id) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="lesson-accordions-image-screen">
      <header className="lesson-accordions-image-header">
        <p>
          تعرض هذه الصفحة تأثيرات المواد الكيميائية على الصحة والبيئة، مع شرح مبسط يساعد المستخدم على
          فهم المخاطر وكيفية الوقاية منها.
        </p>
      </header>

      <article className="lesson-accordions-image-card-shell">
        <div className="lesson-accordions-image-layout">
          <ImageCard src="/Chemestry1.png" alt="" />
          <div className="lesson-accordions-list">
            {accordionItems.map((item) => (
              <Accordion
                key={item.id}
                id={item.id}
                title={item.title}
                content={item.content}
                isOpen={openId === item.id}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
