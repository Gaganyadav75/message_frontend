import { IconButton, Typography } from "@mui/material";
import { MouseEventHandler, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import DialogBox from "../reusable/DialogBox";
import { publish } from "../../handlers/reusable/Event";
import { getFileUrl } from "../reusable/profileUrl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";

type FilesCarousalType = {
  openPreview?: boolean;
  ViewList?: any[] | null;
  needDialogBox?: boolean;
  onCancelClick?: MouseEventHandler<HTMLElement> | undefined;
  AddClasses?: string;
  selectedItem?: number;
  onSwipe?:(swiper:any) => void;
};

function FilesCarousal({
  openPreview= true,
  ViewList,
  needDialogBox = true,
  onCancelClick,
  AddClasses = "",
  selectedItem = 0,
  onSwipe
}: FilesCarousalType) {
  const [dialog, setDiolog] = useState(false);

  if (!openPreview) {
    return null;
  }


  return (
    <>
      <div
        className={
          "w-full h-full absolute top-0 left-0 backdrop-blur-lg flex justify-center z-[2000] " + AddClasses
        }
      >
        <IconButton
          sx={{
            zIndex: 2001,
            color: "red",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          onClick={
            needDialogBox
              ? () => {
                  setDiolog(true);
                }
              : onCancelClick
          }
        >
          <CancelIcon />
        </IconButton>
        
        {ViewList && (ViewList?.length>1 ?
          <Swiper
          modules={[Navigation,Keyboard]}
          initialSlide={selectedItem}
          onSlideChange={onSwipe}
          keyboard= {{
            enabled: true,
            onlyInViewport: true
          }}
          slidesPerView={1}
          navigation={{
            nextEl: ".next-btn1",
            prevEl: ".prev-btn1",
          }}
        >

        {
        ViewList.map((ele, ind) => {
          return (
            <SwiperSlide className="w-full h-full" key={"view-list-" + "-" + ind}>
              
              <EachFileInList
                type={ele.type}
                url={getFileUrl(ele?.attach, "uploads")}
                index={ind}
                name={ele?.text}
              />
          
            </SwiperSlide>
          );
        })
          }
          </Swiper>
          :
        <div className="h-full flex justify-center items-center ">
          <img src={ViewList[0].attach} alt={"viwing an image"} className="object-contain h-[80%]" />
           {ViewList[0].text && <Typography
            variant="h5"
            className="absolute top-0 pt-5 pb-2 w-full hover:bg-gray-500 transition-colors delay-300	ease-in-out duration-1000 whitespace-nowrap px-20 text-ellipsis overflow-hidden">
              {ViewList[0].text}
            </Typography>
          }
        </div>)
        }
      </div>

{  
  (ViewList && ViewList?.length>1)
                &&
      <NavigateButtons btn={1} />
}


      {dialog && (
        <DialogBox
          AgreeFunction={() => {
            publish("close-file-preview", true);
          }}
          setDialogBoxOpen={setDiolog}
          yes="Disacard"
          no="continue"
        />
      )}
    </>
  );
}

export default FilesCarousal;

type EachFileListType = {
  type: string;
  index: number;
  url: string;
  name?: string;
};

export const EachFileInList = ({ type, index, url, name }: EachFileListType) => {
  return (
    <div
      key={index}
      className="w-full h-full  flex-col gap-2 flex justify-center items-center"
    >
     {name && <Typography
        variant="h5"
        className="absolute top-0 pt-5 pb-2 w-full hover:bg-gray-500 transition-colors delay-300	ease-in-out duration-1000 whitespace-nowrap px-20 text-ellipsis overflow-hidden"
      >
        {name}
      </Typography>}

      <div className="h-[80%] flex justify-center items-center">
        {type.startsWith("image") && (
          <img src={url} alt={name} className="object-contain h-full" />
        )}
        {type.startsWith("video") && (
          <video src={url} className="object-contain h-full" controls />
        )}
        {type.startsWith("application") && (
          <object
            data={url}
            type="application/pdf"
            className="object-contain h-full"
          >
            <p>
              Your browser does not support PDFs.{" "}
              <a href={url} target="_blank">
                View PDF
              </a>
              .
            </p>
          </object>
        )}
      </div>
    </div>
  );
};







export const NavigateButtons = ({btn=1})=>{
    return  <>
          <button
            data-slot="carousel-previous"
            className={"absolute top-1/2 -translate-y-1/2  left-5 inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 prev-btn"+btn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left" aria-hidden="true">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            <span className="sr-only">Previous slide</span>
          </button>
          <button
            data-slot="carousel-next"
            className={"absolute top-1/2 -translate-y-1/2  right-5 inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 next-btn"+btn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
            <span className="sr-only">Next slide</span>
          </button>
        </>
}