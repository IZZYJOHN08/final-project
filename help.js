/*==========================
        FAQ ACCORDION
===========================*/

const faqs = document.querySelectorAll(".faq-item");

faqs.forEach(item=>{

    item.querySelector(".faq-question").addEventListener("click",()=>{

        faqs.forEach(f=>{

            if(f!==item){

                f.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});
/*==========================
      CATEGORY CARDS
===========================*/

const cards=document.querySelectorAll(".help-card");

cards.forEach(card=>{

    card.addEventListener("click",()=>{

        const category=card.dataset.category;

        const target=document.querySelector(
            `.faq-item[data-category="${category}"]`
        );

        if(target){

            faqs.forEach(f=>{

                f.classList.remove("active");

            });

            target.classList.add("active");

            target.scrollIntoView({

                behavior:"smooth",

                block:"center"

            });

        }

    });

});
const animated = document.querySelectorAll(
    ".help-card, .faq-item, .support-card"
);

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{threshold:.2});

animated.forEach(item=>{

item.classList.add("fade-up");

observer.observe(item);

});