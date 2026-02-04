"use client"

import React from "react"

const Topbar = () => {
  return (
    <div
      id="top-bar"
      className="fixed top-0 w-[calc(100%-250px)] z-50 flex justify-between items-center h-20 bg-white px-[30px] border-b border-lms-grey"
    >
      <form action="#">
        <label className="relative">
          <input
            type="text"
            className="appearance-none outline-hidden w-[430px] h-11 rounded-full bg-white border border-lms-grey py-[10px] px-5 pr-12 font-semibold placeholder:font-normal placeholder:text-lms-text-secondary input-focus"
            placeholder="Search your own courses..."
          />
          <button
            type="button"
            className="absolute transform -translate-y-1/2 top-1/2 right-5 z-10"
          >
            <img
              src="/searchnormal1.svg"
              className="flex shrink-0"
              alt="icon"
            />
          </button>
        </label>
      </form>
      <div className="flex items-center gap-[30px] h-full">
        <div className="flex items-center gap-5">
          <a href="#" className="flex shrink-0">
            <img src="/directinbox.svg" alt="icon" />
          </a>
          <a href="#" className="flex shrink-0">
            <img src="/gift.svg" alt="icon" />
          </a>
          <a href="#" className="flex shrink-0">
            <img src="/notification.svg" alt="icon" />
          </a>
        </div>
        <div className="flex h-full w-px border border-lms-grey"></div>
        <div className="flex items-center gap-[11px]">
          <div className="text-right">
            <p className="font-semibold">Jannet Hun</p>
            <p className="text-xs leading-[18px] text-lms-text-secondary -mt-[5px]">
              Manager
            </p>
          </div>
          <div className="flex shrink-0 w-10 h-10 rounded-full overflow-hidden bg-lms-orange items-center justify-center font-['Inter']">
            <span className="font-bold text-lg leading-[22px]">J</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar
