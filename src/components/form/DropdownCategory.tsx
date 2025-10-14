/* eslint-disable react/display-name */

import type { Dispatch, SetStateAction } from 'react'

import { useEffect, useMemo, useRef, useState } from 'react'

import Image from 'next/image'

import { useSearchParams } from 'next/navigation'

import clsx from 'clsx'
import { Add, ArrowDown2, CloseCircle, FolderOpen, Minus } from 'iconsax-react'

import { useStore } from '@/contexts/StoreContainer'
import type { Category } from '@/types/global'

interface Props {
  setSelectedCategory?: Dispatch<SetStateAction<Category | undefined>>
  setIsNullCat?: Dispatch<SetStateAction<boolean>>
  onChange?: (e: Category) => void
  onClear?: () => void
  type?: string
  textDefault?: string
  icon?: boolean
}

const DropdownCategory = ({
  setSelectedCategory,
  setIsNullCat,
  onChange,
  type,
  textDefault,
  onClear,
  icon = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [treeCategoryData, setTreeCategoryData] = useState<Category[]>()
  const { treeData } = useStore()
  const refDiv = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  const queryObject = useMemo(() => {
    if (!searchParams) return {}

    return Object.fromEntries(searchParams.entries())
  }, [searchParams])

  useEffect(() => {
    setTreeCategoryData(treeData)
  }, [treeData])

  const updateOpenStateById = (
    categories: Category[] | undefined,
    targetId: number,
  ): Category[] | undefined => {
    return categories?.map((category: any) => {
      if (category.id === targetId) {
        return {
          ...category,
          open: !category.open,
          children: updateOpenStateById(category?.children, targetId),
        }
      }

      if (category?.children && category?.children?.length > 0) {
        return {
          ...category,
          children: updateOpenStateById(category?.children, targetId),
        }
      }

      return category
    })
  }

  const handleOpenCategoryById = (targetId: number) => {
    const updatedCategories = updateOpenStateById(treeCategoryData, targetId)

    setTreeCategoryData(updatedCategories as Category[] | undefined)
  }

  const handleOpenCategoryTree = () => {
    return setIsOpen(true)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refDiv.current && !refDiv.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelectedCategory = (e: Category) => {
    if (setIsNullCat) {
      setIsNullCat(false)
    }

    if (setSelectedCategory) {
      setSelectedCategory(e)
    }

    if (onChange) {
      onChange(e)
    }

    setIsOpen(false)
  }

  const renderTreeItem = (data: Category[], level: number) => {
    return data.map((item: Category) => {
      return (
        <li
          key={`${item.id}_${level}`}
          className={clsx(
            'relative w-full items-center text-xs text-grey-600 ',
            level !== 0 ? `item_${level} pl-6` : 'pl-1',
          )}
        >
          <div
            className={clsx(
              'flex w-full flex-row gap-x-3 rounded-md p-1 hover:bg-primary-100',
              level !== 0 ? '' : null,
            )}
          >
            <span
              role="button"
              className={clsx(
                'flex w-full cursor-pointer flex-row items-center text-base',
                type === 'category' ? 'gap-x-2' : 'gap-2',
              )}
              onClick={() => handleSelectedCategory(item)}
              tabIndex={0}
            >
              <Image
                sizes="28"
                src={item?.thumbnail || ''}
                alt={item?.name}
                width={28}
                height={28}
                className={clsx(
                  'rounded-md border border-grey-100 bg-white p-px',
                  type === 'category' ? 'size-6' : 'size-[30px]',
                )}
              />

              {item.name}
            </span>
            {item?.children && item?.children?.length > 0 && (
              <span
                className="relative z-50 cursor-pointer"
                onClick={() => handleOpenCategoryById(item.id)}
              >
                {item.open ? (
                  <Minus
                    color="#FF8A65"
                    size={type === 'category' ? '18' : '22'}
                  />
                ) : (
                  <Add
                    color="#FF8A65"
                    size={type === 'category' ? '18' : '22'}
                  />
                )}
              </span>
            )}
          </div>
          {item?.children && item?.children?.length > 0 && item.open && (
            <ul
              className={clsx('childrenList relative flex flex-wrap')}
              role="menu"
              tabIndex={-1}
            >
              {renderTreeItem(item?.children, level + 1)}
            </ul>
          )}
        </li>
      )
    })
  }

  return (
    <div className="relative flex min-w-[220px] cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-[6px] border border-border-input bg-white text-left">
      <span className="absolute right-3 top-1/2 z-50 w-4 -translate-y-[40%]">
        {textDefault && queryObject?.categories ? (
          <CloseCircle
            size={24}
            variant="Bold"
            color="#BCB6B2"
            onClick={(e) => {
              e.preventDefault()
              onClear?.()
              setIsOpen(false)
            }}
          />
        ) : (
          <ArrowDown2
            size={14}
            color="#000000"
            onClick={() => handleOpenCategoryTree()}
          />
        )}
      </span>
      <div
        className={`items-center flex w-full gap-2 px-3 h-9  leading-6 text-[0.85rem] ${type === 'category' ? 'px-1 text-grey-600' : 'text-grey-400 '}`}
        onClick={() => handleOpenCategoryTree()}
      >
        {icon && <FolderOpen size="22" color="#2C2A29" />}
        <p className="block leading-6">{textDefault}</p>
      </div>
      {isOpen && (
        <div
          className={clsx(
            'absolute left-0 top-full z-50 mt-2 min-w-80 bg-white shadow md:mt-0 md:min-w-full',
            type === 'category'
              ? 'rounded-lg px-2 py-3 text-xs'
              : 'rounded-2xl py-5 pl-3 pr-2 text-xs',
          )}
          ref={refDiv}
        >
          <ul className="flex max-h-[500px] flex-wrap overflow-y-auto">
            {treeCategoryData && renderTreeItem(treeCategoryData, 0)}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DropdownCategory
