import { NextPage } from 'next';
import MainLayout from '@com/Layout/Main';

type PageWithMainLayoutType = NextPage & { layout: typeof MainLayout, title?: string }

// type PageWithPostLayoutType = NextPage & { layout: typeof SecondaryLayout }

// type PageWithLayoutType = PageWithMainLayoutType | PageWithPostLayoutType
type PageWithLayoutType = PageWithMainLayoutType

export default PageWithLayoutType;