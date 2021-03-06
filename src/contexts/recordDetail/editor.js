import React from 'react'
import ReactDOM from 'react-dom'
import { css } from 'emotion'
import colors from '@pndr/colors'
import Button from '@pndr/button'
import OptionList from '@pndr/select/lib/OptionList'
import AdaptiveDialog from '@pndr/adaptive-dialog/lib/AdaptiveDialog'
import Option from '../../Option'

const EmptyState = ({ children }) => (
    <div
        className={css`
            background: #f9f9f9;
            border-radius: 6px;
            padding: 30px;
            text-align: center;
            @media (min-width: 720px) {
                padding-top: 50px;
                padding-bottom: 50px;
            }
        `}
    >
        <div
            className={css`
                color: #000;
                font-size: 16px;
            `}
        >
            {children}
        </div>
    </div>
)

export default class MultipleSelectField extends React.Component {

    state = {
        open: false
    }

    componentDidMount() {

        this.button = ReactDOM.findDOMNode(this.refs.button)
    }

    optionRenderer = ({ option }) => {

        const color = colors[option.colorId] || defaultColor

        return (
            <div
                className={css`
                    background-color: ${color.backgroundColor};
                    color: ${color.color};
                    min-width: 18px;
                    height: 18px;
                    font-size: 13px;
                    font-weight: 400;
                    max-width: 100%;
                    align-items: center;
                    display: inline-flex;
                    padding-left: 8px;
                    padding-right: 8px;
                    line-height: 1.5;
                    -webkit-print-color-adjust: exact;
                    border-radius: 6px;
                    flex: 0 0 auto;
                `}
            >
                {option.name}
            </div>
        )
    }

    render() {

        const optionsById = this.props.options.reduce((result, option) => {
            result[option.id] = option
            return result
        }, {})

        const options = this.props.options.filter(option => {
            return this.props.optionIds.includes(option.id) === false
        })

        return (
            <div>
                <div
                    className={css`
                        margin-bottom: 24px;
                    `}
                >
                    <div
                        className={css`
                            position: relative;
                        `}
                    >
                        <Button
                            ref={'button'}
                            size={'sm'}
                            onClick={() => this.setState({ open: true })}
                        >
                            {this.props.selectAnOptionButtonLabel}
                        </Button>
                        {this.state.open ? (
                            <AdaptiveDialog
                                referenceElement={this.button}
                                popoverPlacement={'bottom-start'}
                                popoverWidth={300}
                                title={this.props.title}
                            >
                                {() => (
                                    <OptionList
                                        alignLeft={true}
                                        options={options}
                                        optionRenderer={this.optionRenderer}
                                        onOptionClick={this.handleOptionLink}
                                        onClickOutside={() => this.setState({ open: false })}
                                    />
                                )}
                            </AdaptiveDialog>
                        ) : null}
                    </div>
                </div>
                {this.props.optionIds && this.props.optionIds.length ? this.props.optionIds.map(id => {

                    const option = optionsById[id]

                    return (
                        <div
                            key={option.id}
                            className={css`
                                max-width: 100%;
                                cursor: pointer;
                                align-items: center;
                                display: inline-flex;
                                flex: none;
                                margin-top: 4px;
                                margin-bottom: 4px;
                                margin-right: 4px;
                            `}
                        >
                            <Option
                                option={option}
                                onRemove={this.handleOptionUnlink}
                            />
                        </div>

                    )
                }) : (
                        <EmptyState>
                            There are no options selected for this field
                    </EmptyState>
                    )}
            </div>
        )
    }

    handleOptionLink = ({ id }) => {

        this.setState({ open: false })

        if (this.props.onOptionLink) {
            this.props.onOptionLink({
                id: this.props.id,
                optionId: id
            })
        }
    }

    handleOptionUnlink = ({ id }) => {

        if (this.props.onOptionUnlink) {
            this.props.onOptionUnlink({
                id: this.props.id,
                optionId: id
            })
        }
    }
}