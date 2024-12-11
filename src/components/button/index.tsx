import { TouchableOpacity, TouchableOpacityProps, Text, TextProps, ActivityIndicator } from 'react-native'
import { IconProps as TablerIconProsp } from '@tabler/icons-react-native'

import { s } from './styles'
import { colors } from '@/styles/theme'


type ButtonProps = TouchableOpacityProps & {
    isLoading?: boolean
}


function Button({ children, style, isLoading = false, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity
            style={[s.container, style]}
            activeOpacity={.8}
            disabled={isLoading}
            {...rest}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={colors.gray[100]} />
            ) : (
                children
            )}
        </TouchableOpacity>
    )
}





type IconProps = {
    icon: React.ComponentType<TablerIconProsp>
}


function Icon({ icon: Icon }: IconProps) {
    return <Icon size={24} color={colors.gray[100]}/>
}



function Title({ children }: TextProps) {
    return (
        <Text style={s.title}>{children}</Text>
    )
}


Button.Title = Title
Button.Icon = Icon

export { Button }